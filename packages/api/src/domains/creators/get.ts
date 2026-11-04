import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { publicProcedure } from "../../index";
import { creatorInclude, publicCreatorWhere } from "../shared/query-shapes";
import { serializeCreator } from "./serialize-creator";
export const getCreator = publicProcedure
  .input(z.object({ handle: z.string().max(40) }))
  .handler(async ({ context, input }) => {
    const row = await context.db.creatorProfile.findFirst({
      include: creatorInclude,
      where: { handle: input.handle, ...publicCreatorWhere },
    });
    if (!row) {
      throw new ORPCError("NOT_FOUND");
    }
    return await serializeCreator(context.db, row, context.viewer?.id);
  });
