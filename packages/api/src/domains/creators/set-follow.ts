import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure } from "../../index";
import { publicCreatorWhere } from "../shared/query-shapes";
export const setFollow = protectedProcedure
  .input(z.object({ creatorId: z.string(), following: z.boolean() }))
  .handler(async ({ context, input }) => {
    const creator = await context.db.creatorProfile.findFirst({
      where: { id: input.creatorId, ...publicCreatorWhere },
    });
    if (!creator) {
      throw new ORPCError("NOT_FOUND");
    }
    const pair = { creatorId: creator.id, userId: context.viewer.id };
    if (input.following) {
      await context.db.follow.upsert({
        create: pair,
        update: {},
        where: { userId_creatorId: pair },
      });
    } else {
      await context.db.follow.deleteMany({ where: pair });
    }
    return { following: input.following };
  });
