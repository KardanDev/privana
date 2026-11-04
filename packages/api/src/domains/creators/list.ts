import { z } from "zod";
import { publicProcedure } from "../../index";
import {
  creatorInclude,
  pageInput,
  publicCreatorWhere,
} from "../shared/query-shapes";
import { serializeCreator } from "./serialize-creator";
export const listCreators = publicProcedure
  .input(
    pageInput
      .extend({
        category: z.string().max(60).optional(),
        search: z.string().max(100).optional(),
      })
      .optional()
  )
  .handler(async ({ context, input }) => {
    const { cursor, limit = 12, search, category } = input ?? {};
    const rows = await context.db.creatorProfile.findMany({
      include: creatorInclude,
      orderBy: { id: "desc" },
      take: limit + 1,
      where: {
        ...publicCreatorWhere,
        ...(category ? { category } : {}),
        ...(search
          ? {
              OR: [
                { displayName: { contains: search, mode: "insensitive" } },
                { handle: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
    const items = await Promise.all(
      rows
        .slice(0, limit)
        .map((row) => serializeCreator(context.db, row, context.viewer?.id))
    );
    return {
      items,
      nextCursor: rows.length > limit ? (items.at(-1)?.id ?? null) : null,
    };
  });
