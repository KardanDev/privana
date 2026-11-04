import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure } from "../../index";
import { requirePlatformFeature } from "../platform/require-feature";
export const startConversation = protectedProcedure
  .input(z.object({ userId: z.string() }))
  .handler(async ({ context, input }) => {
    await requirePlatformFeature(context.db, "messaging");
    if (input.userId === context.viewer.id) {
      throw new ORPCError("BAD_REQUEST");
    }
    const other = await context.db.user.findFirst({
      where: { id: input.userId, status: "ACTIVE" },
    });
    if (!other) {
      throw new ORPCError("NOT_FOUND");
    }
    const [participantAId, participantBId] = [
      context.viewer.id,
      input.userId,
    ].sort();
    if (!(participantAId && participantBId)) {
      throw new ORPCError("BAD_REQUEST");
    }
    const pair = { participantAId, participantBId };
    const row = await context.db.conversation.upsert({
      create: pair,
      update: {},
      where: { participantAId_participantBId: pair },
    });
    return { id: row.id };
  });
