import { z } from "zod";
import { protectedProcedure } from "../../index";
import { authorizePostMedia } from "../access/authorize-post-media";
import { createComment } from "./create-comment";
export const addComment = protectedProcedure
  .input(
    z.object({
      body: z.string().trim().min(1).max(2000),
      clientCommentId: z
        .uuid()
        .transform((id) => id.toLowerCase())
        .optional(),
      postId: z.string(),
    })
  )
  .handler(async ({ context, input }) => {
    await authorizePostMedia(context.db, input.postId, context.viewer.id);
    const row = await context.db.$transaction(
      async (tx) =>
        await createComment(tx, { ...input, userId: context.viewer.id })
    );
    return {
      author: {
        id: context.viewer.id,
        image: context.viewer.image,
        name: context.viewer.name,
      },
      body: row.body,
      createdAt: row.createdAt.toISOString(),
      id: row.id,
    };
  });
