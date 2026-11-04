import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure } from "../../index";
import { publicCreatorWhere } from "../shared/query-shapes";
export const requestMembership = protectedProcedure
  .input(z.object({ creatorId: z.string() }))
  .handler(async ({ context, input }) => {
    const creator = await context.db.creatorProfile.findFirst({
      where: { id: input.creatorId, ...publicCreatorWhere },
    });
    if (!creator) {
      throw new ORPCError("NOT_FOUND");
    }
    const pair = { creatorId: input.creatorId, userId: context.viewer.id };
    await context.db.membershipInterest.upsert({
      create: pair,
      update: {},
      where: { userId_creatorId: pair },
    });
    return { status: "INTEREST_REGISTERED" as const };
  });
