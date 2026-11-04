import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure } from "../../index";
import { requireParticipant } from "../access/require-participant";
export const getMessages = protectedProcedure
  .input(
    z.object({
      before: z.string().min(1).optional(),
      conversationId: z.string(),
    })
  )
  .handler(async ({ context, input }) => {
    const conversation = await context.db.conversation.findUnique({
      where: { id: input.conversationId },
    });
    if (!conversation) {
      throw new ORPCError("NOT_FOUND");
    }
    requireParticipant(context.viewer.id, conversation);
    const boundary = input.before
      ? await context.db.message.findFirst({
          select: { createdAt: true, id: true },
          where: { conversationId: conversation.id, id: input.before },
        })
      : null;
    if (input.before && !boundary) {
      throw new ORPCError("NOT_FOUND");
    }
    const rows = await context.db.message.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 50,
      where: {
        conversationId: conversation.id,
        ...(boundary
          ? {
              OR: [
                { createdAt: { lt: boundary.createdAt } },
                { createdAt: boundary.createdAt, id: { lt: boundary.id } },
              ],
            }
          : {}),
      },
    });
    return rows.reverse().map((row) => ({
      body: row.body,
      createdAt: row.createdAt.toISOString(),
      id: row.id,
      senderId: row.senderId,
    }));
  });
