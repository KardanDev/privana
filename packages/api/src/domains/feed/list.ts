import { z } from "zod";
import { publicProcedure } from "../../index";
import { serializePosts } from "../posts/serialize-posts";
import {
  pageInput,
  postInclude,
  publicPostWhere,
} from "../shared/query-shapes";
export const listFeed = publicProcedure
  .input(
    pageInput
      .extend({
        creatorId: z.string().optional(),
        following: z.boolean().optional(),
        saved: z.boolean().optional(),
      })
      .optional()
  )
  .handler(async ({ context, input }) => {
    const { cursor, limit = 12, creatorId, saved, following } = input ?? {};
    if ((saved || following) && !context.viewer) {
      return { items: [], nextCursor: null };
    }
    const rows = await context.db.post.findMany({
      include: postInclude,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
      where: {
        ...publicPostWhere,
        ...(creatorId ? { creatorId } : {}),
        ...(saved
          ? { bookmarks: { some: { userId: context.viewer?.id } } }
          : {}),
        ...(following
          ? {
              creator: {
                ...publicPostWhere.creator,
                followers: { some: { userId: context.viewer?.id } },
              },
            }
          : {}),
      },
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
    const items = await serializePosts(
      context.db,
      rows.slice(0, limit),
      context.viewer
    );
    return {
      items,
      nextCursor: rows.length > limit ? (items.at(-1)?.id ?? null) : null,
    };
  });
