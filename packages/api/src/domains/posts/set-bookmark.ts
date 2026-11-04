import { z } from "zod";
import { protectedProcedure } from "../../index";
import { requireVisiblePost } from "./require-visible-post";
export const setBookmark = protectedProcedure
  .input(z.object({ bookmarked: z.boolean(), postId: z.string() }))
  .handler(async ({ context, input }) => {
    await requireVisiblePost(context.db, input.postId);
    const pair = { postId: input.postId, userId: context.viewer.id };
    if (input.bookmarked) {
      await context.db.bookmark.upsert({
        create: pair,
        update: {},
        where: { userId_postId: pair },
      });
    } else {
      await context.db.bookmark.deleteMany({ where: pair });
    }
    return { bookmarked: input.bookmarked };
  });
