import { z } from "zod";
import { protectedProcedure } from "../../index";
import { authorizePostMedia } from "../access/authorize-post-media";
export const addComment = protectedProcedure
  .input(
    z.object({ body: z.string().trim().min(1).max(2000), postId: z.string() })
  )
  .handler(async ({ context, input }) => {
    await authorizePostMedia(context.db, input.postId, context.viewer.id);
    const row = await context.db.comment.create({
      data: { ...input, userId: context.viewer.id },
    });
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
