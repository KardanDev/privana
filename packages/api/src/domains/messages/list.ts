import { protectedProcedure } from "../../index";
export const listConversations = protectedProcedure.handler(
  async ({ context }) => {
    const rows = await context.db.conversation.findMany({
      include: {
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
        participantA: { select: { id: true, image: true, name: true } },
        participantB: { select: { id: true, image: true, name: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
      where: {
        OR: [
          { participantAId: context.viewer.id },
          { participantBId: context.viewer.id },
        ],
      },
    });
    return rows.map((row) => ({
      id: row.id,
      lastMessage: row.messages[0]?.body ?? null,
      otherUser:
        row.participantAId === context.viewer.id
          ? row.participantB
          : row.participantA,
      updatedAt: row.updatedAt.toISOString(),
    }));
  }
);
