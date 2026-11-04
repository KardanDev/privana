import { z } from "zod";
import { protectedProcedure } from "../../index";
import { requireVisiblePost } from "./require-visible-post";
export const setLike = protectedProcedure
  .input(z.object({ liked: z.boolean(), postId: z.string() }))
  .handler(async ({ context, input }) => {
    await requireVisiblePost(context.db, input.postId);
    const pair = { postId: input.postId, userId: context.viewer.id };
    if (input.liked) {
      await context.db.like.upsert({
        create: pair,
        update: {},
        where: { userId_postId: pair },
      });
    } else {
      await context.db.like.deleteMany({ where: pair });
    }
    return { liked: input.liked };
  });
