import { z } from "zod";
import { publicProcedure } from "../../index";
import { authorizePostMedia } from "../access/authorize-post-media";
import { pageInput } from "../shared/query-shapes";
export const listComments = publicProcedure
  .input(pageInput.extend({ postId: z.string() }))
  .handler(async ({ context, input }) => {
    await authorizePostMedia(context.db, input.postId, context.viewer?.id);
    const rows = await context.db.comment.findMany({
      include: { user: { select: { id: true, image: true, name: true } } },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      take: input.limit + 1,
      where: { postId: input.postId, user: { status: "ACTIVE" } },
      ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
    });
    const items = rows.slice(0, input.limit).map((row) => ({
      author: row.user,
      body: row.body,
      createdAt: row.createdAt.toISOString(),
      id: row.id,
    }));
    return {
      items,
      nextCursor: rows.length > input.limit ? (items.at(-1)?.id ?? null) : null,
    };
  });
