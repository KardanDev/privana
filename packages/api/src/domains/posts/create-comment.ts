import { ORPCError } from "@orpc/server";
import type { Prisma } from "@privana/db/client";

interface CommentWrite {
  body: string;
  clientCommentId?: string;
  postId: string;
  userId: string;
}

export async function createComment(
  tx: Prisma.TransactionClient,
  input: CommentWrite
) {
  const { clientCommentId, ...data } = input;
  if (!clientCommentId) {
    return await tx.comment.create({ data });
  }
  // The existing primary key arbitrates simultaneous retries without extra rows.
  await tx.comment.createMany({
    data: [{ ...data, id: clientCommentId }],
    skipDuplicates: true,
  });
  const comment = await tx.comment.findUnique({
    where: { id: clientCommentId },
  });
  if (
    !comment ||
    comment.userId !== input.userId ||
    comment.postId !== input.postId ||
    comment.body !== input.body
  ) {
    throw new ORPCError("CONFLICT", {
      message: "Este identificador já foi utilizado em outro comentário.",
    });
  }
  return comment;
}
