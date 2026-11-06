import { ORPCError } from "@orpc/server";
import type { Prisma } from "@privana/db/client";

interface MessageWrite {
  body: string;
  clientMessageId?: string;
  conversationId: string;
  senderId: string;
}

export async function createMessage(
  tx: Prisma.TransactionClient,
  input: MessageWrite
) {
  const { clientMessageId, ...data } = input;
  if (!clientMessageId) {
    return { created: true, message: await tx.message.create({ data }) };
  }
  // PostgreSQL's unique primary key arbitrates concurrent retries. Only the
  // transaction that inserts the row may create notifications or move the inbox.
  const inserted = await tx.message.createMany({
    data: [{ ...data, id: clientMessageId }],
    skipDuplicates: true,
  });
  const message = await tx.message.findUnique({
    where: { id: clientMessageId },
  });
  if (!message) {
    throw new ORPCError("CONFLICT", {
      message: "Não foi possível confirmar esta mensagem. Tente novamente.",
    });
  }
  if (
    message.senderId !== input.senderId ||
    message.conversationId !== input.conversationId ||
    message.body !== input.body
  ) {
    throw new ORPCError("CONFLICT", {
      message: "Este identificador já foi utilizado em outra mensagem.",
    });
  }
  return { created: inserted.count === 1, message };
}
