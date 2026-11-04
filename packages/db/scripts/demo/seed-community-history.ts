import type { Prisma } from "../../prisma/generated/client";
import { assertDemoRecordOwner } from "./assert-demo-record-owner";
import type { DemoCreatorDefinition } from "./definitions";

export async function seedCommunityHistory(
  tx: Prisma.TransactionClient,
  creator: DemoCreatorDefinition,
  index: number,
  now: Date
): Promise<void> {
  if (creator.status !== "ACTIVE") {
    return;
  }
  const memberId = "demo-role-member";
  const creatorId = `demo-profile-${creator.handle}`;
  const [participantAId, participantBId] = [memberId, creator.userId].sort();
  if (!(participantAId && participantBId)) {
    throw new Error("Participantes ausentes.");
  }
  const pair = { participantAId, participantBId };
  const conversation = await tx.conversation.upsert({
    create: { ...pair, id: `demo-chat-${creator.handle}` },
    update: {},
    where: { participantAId_participantBId: pair },
  });
  await Promise.all(
    Array.from({ length: 8 }, async (_, position) => {
      const id = `demo-chat-message-${creator.handle}-${position}`;
      const senderId = position % 2 === 0 ? memberId : creator.userId;
      assertDemoRecordOwner(await tx.message.findUnique({ where: { id } }), {
        conversationId: conversation.id,
        senderId,
      });
      const messages = [
        "Oi! Adorei conhecer seu trabalho por aqui.",
        "Que bom ter você por perto! Fique à vontade para conhecer as publicações.",
        "Gostei muito dos bastidores. Você pretende mostrar mais do processo?",
        "Sim! Estou preparando uma série com mais detalhes.",
        "Vou acompanhar. Gosto de ver como cada ideia começa.",
        "Também adoro dividir essa parte. Obrigada pela companhia!",
        "Já salvei minhas publicações favoritas para ver com calma.",
        "Fico feliz! Me conte depois qual foi a sua preferida.",
      ];
      await tx.message.upsert({
        create: {
          body: messages[position] ?? "Olá!",
          conversationId: conversation.id,
          createdAt: new Date(
            now.getTime() - (index * 24 + 8 - position) * 3_600_000
          ),
          id,
          senderId,
        },
        update: {},
        where: { id },
      });
    })
  );
  await Promise.all(
    [0, 1, 2, 4, 6].map(async (position) => {
      const postId = `demo-history-${creator.handle}-${position}`;
      const id = `demo-history-comment-${creator.handle}-${position}`;
      assertDemoRecordOwner(await tx.comment.findUnique({ where: { id } }), {
        postId,
        userId: memberId,
      });
      await tx.comment.upsert({
        create: {
          body:
            [
              "Adorei os detalhes! Obrigada por compartilhar.",
              "Já quero ver a próxima publicação.",
              "Muito bom acompanhar esse processo de perto.",
            ][position % 3] ?? "Lindo trabalho!",
          createdAt: new Date(
            now.getTime() - (position * 36 + index * 3) * 3_600_000
          ),
          id,
          postId,
          userId: memberId,
        },
        update: {},
        where: { id },
      });
      await tx.like.upsert({
        create: {
          id: `demo-history-like-${creator.handle}-${position}`,
          postId,
          userId: memberId,
        },
        update: {},
        where: { userId_postId: { postId, userId: memberId } },
      });
    })
  );
  await tx.membershipInterest.upsert({
    create: {
      creatorId,
      id: `demo-history-interest-${creator.handle}`,
      userId: memberId,
    },
    update: {},
    where: { userId_creatorId: { creatorId, userId: memberId } },
  });
  const notificationId = `demo-history-notification-${creator.handle}`;
  assertDemoRecordOwner(
    await tx.notification.findUnique({ where: { id: notificationId } }),
    { userId: memberId }
  );
  await tx.notification.upsert({
    create: {
      body: "Uma nova publicação de demonstração está esperando por você.",
      createdAt: new Date(now.getTime() - (index + 1) * 3_600_000),
      href: `/creators/${creator.handle}`,
      id: notificationId,
      readAt: index % 2 === 0 ? null : now,
      title: `${creator.name} publicou novidades`,
      userId: memberId,
    },
    update: {},
    where: { id: notificationId },
  });
}
