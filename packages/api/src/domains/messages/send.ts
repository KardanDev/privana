import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure } from "../../index";
import { requireParticipant } from "../access/require-participant";
import { requirePlatformFeature } from "../platform/require-feature";
export const sendMessage = protectedProcedure
  .input(
    z.object({
      body: z.string().trim().min(1).max(5000),
      conversationId: z.string(),
    })
  )
  .handler(async ({ context, input }) => {
    await requirePlatformFeature(context.db, "messaging");
    const c = await context.db.conversation.findUnique({
      include: { participantA: true, participantB: true },
      where: { id: input.conversationId },
    });
    if (!c) {
      throw new ORPCError("NOT_FOUND");
    }
    requireParticipant(context.viewer.id, c);
    if (
      c.participantA.status !== "ACTIVE" ||
      c.participantB.status !== "ACTIVE"
    ) {
      throw new ORPCError("FORBIDDEN");
    }
    const row = await context.db.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: { ...input, senderId: context.viewer.id },
      });
      await tx.conversation.update({
        data: { updatedAt: new Date() },
        where: { id: c.id },
      });
      await tx.notification.create({
        data: {
          body: `${context.viewer.name} enviou uma mensagem.`,
          href: "/messages",
          title: "Nova mensagem",
          userId:
            c.participantAId === context.viewer.id
              ? c.participantBId
              : c.participantAId,
        },
      });
      return message;
    });
    return {
      body: row.body,
      createdAt: row.createdAt.toISOString(),
      id: row.id,
      senderId: row.senderId,
    };
  });
