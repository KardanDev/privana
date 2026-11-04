import type { Prisma } from "../../prisma/generated/client";
import { assertDemoRecordOwner } from "./assert-demo-record-owner";
import type { seedDemoProfile } from "./seed-demo-profile";
export async function seedDemoSocial(
  tx: Prisma.TransactionClient,
  creators: Awaited<ReturnType<typeof seedDemoProfile>>[],
  now: Date
): Promise<void> {
  const memberId = "demo-role-member";
  const luna = creators.find(
    (creator) => creator.profile.userId === "demo-luna-demo"
  );
  if (!luna) {
    throw new Error("O perfil de demonstração principal não foi preparado.");
  }
  await Promise.all(
    creators
      .filter((creator) => creator.profile.status === "ACTIVE")
      .map(async (creator) => {
        await tx.follow.upsert({
          create: {
            creatorId: creator.profile.id,
            id: `demo-follow-${creator.profile.userId}`,
            userId: memberId,
          },
          update: {},
          where: {
            userId_creatorId: {
              creatorId: creator.profile.id,
              userId: memberId,
            },
          },
        });
        await tx.like.upsert({
          create: {
            id: `demo-like-${creator.profile.userId}`,
            postId: creator.publicPostId,
            userId: memberId,
          },
          update: {},
          where: {
            userId_postId: { postId: creator.publicPostId, userId: memberId },
          },
        });
      })
  );
  await tx.bookmark.upsert({
    create: {
      id: "demo-bookmark-luna",
      postId: luna.publicPostId,
      userId: memberId,
    },
    update: {},
    where: { userId_postId: { postId: luna.publicPostId, userId: memberId } },
  });
  await tx.membershipInterest.upsert({
    create: {
      creatorId: luna.profile.id,
      id: "demo-interest-luna",
      userId: memberId,
    },
    update: {},
    where: {
      userId_creatorId: { creatorId: luna.profile.id, userId: memberId },
    },
  });
  const comments = [
    {
      body: "DEMONSTRAÇÃO · Adorei a luz desta foto! Esse espaço ficou lindo.",
      id: "demo-comment-luna-member",
      postId: luna.publicPostId,
      userId: memberId,
    },
    {
      body: "DEMONSTRAÇÃO · Obrigada por passar por aqui! Quero compartilhar mais deste processo.",
      id: "demo-comment-luna-reply",
      postId: luna.publicPostId,
      userId: luna.profile.userId,
    },
  ];
  await Promise.all(
    comments.map(async (comment) => {
      assertDemoRecordOwner(
        await tx.comment.findUnique({ where: { id: comment.id } }),
        { postId: comment.postId, userId: comment.userId }
      );
      await tx.comment.upsert({
        create: { ...comment, createdAt: new Date(now.getTime() - 7_200_000) },
        update: {},
        where: { id: comment.id },
      });
    })
  );
  const [participantAId, participantBId] = [
    memberId,
    luna.profile.userId,
  ].sort();
  if (!(participantAId && participantBId)) {
    throw new Error("Os participantes de demonstração são inválidos.");
  }
  const pair = { participantAId, participantBId };
  const conversationId = "demo-conversation-member-luna";
  assertDemoRecordOwner(
    await tx.conversation.findUnique({ where: { id: conversationId } }),
    pair
  );
  const conversation = await tx.conversation.upsert({
    create: {
      id: conversationId,
      ...pair,
      updatedAt: new Date(now.getTime() - 5_400_000),
    },
    update: {},
    where: { participantAId_participantBId: pair },
  });
  const messages = [
    {
      body: "DEMONSTRAÇÃO · Oi, Luna! Gostei das suas fotografias. Você vai compartilhar mais bastidores?",
      id: "demo-message-member-hello",
      minutes: 120,
      senderId: memberId,
    },
    {
      body: "DEMONSTRAÇÃO · Oi, Camila! Vou sim. Que bom ter você por aqui. Esta conversa é uma amostra local da comunidade.",
      id: "demo-message-luna-reply",
      minutes: 90,
      senderId: luna.profile.userId,
    },
  ];
  await Promise.all(
    messages.map(async (message) => {
      assertDemoRecordOwner(
        await tx.message.findUnique({ where: { id: message.id } }),
        { conversationId: conversation.id, senderId: message.senderId }
      );
      const { minutes, ...data } = message;
      await tx.message.upsert({
        create: {
          ...data,
          conversationId: conversation.id,
          createdAt: new Date(now.getTime() - minutes * 60_000),
        },
        update: {},
        where: { id: message.id },
      });
    })
  );
  const notifications = [
    {
      body: "Explore os perfis de exemplo, siga criadores e teste suas listas salvas.",
      href: "/explore",
      id: "demo-notification-welcome",
      title: "Demonstração: sua comunidade está pronta",
    },
    {
      body: "Luna respondeu na conversa de exemplo. Nenhuma mensagem foi enviada a pessoas reais.",
      href: "/messages",
      id: "demo-notification-message",
      title: "Demonstração: uma conversa para conhecer",
    },
  ];
  await Promise.all(
    notifications.map(async (notification) => {
      assertDemoRecordOwner(
        await tx.notification.findUnique({ where: { id: notification.id } }),
        { userId: memberId }
      );
      await tx.notification.upsert({
        create: {
          ...notification,
          createdAt: new Date(now.getTime() - 3_600_000),
          userId: memberId,
        },
        update: {},
        where: { id: notification.id },
      });
    })
  );
  const reportId = "demo-report-review";
  assertDemoRecordOwner(
    await tx.report.findUnique({ where: { id: reportId } }),
    { postId: luna.publicPostId, reporterId: memberId }
  );
  await tx.report.upsert({
    create: {
      id: reportId,
      postId: luna.publicPostId,
      reason:
        "DEMONSTRAÇÃO · Denúncia de exemplo para testar a revisão da equipe, sem alegação real.",
      reporterId: memberId,
    },
    update: {},
    where: { id: reportId },
  });
  const auditId = "demo-audit-development-fixtures";
  assertDemoRecordOwner(
    await tx.auditEvent.findUnique({ where: { id: auditId } }),
    { actorId: "demo-role-admin" }
  );
  await tx.auditEvent.upsert({
    create: {
      action: "DEMO_FIXTURES_PREPARED",
      actorId: "demo-role-admin",
      id: auditId,
      metadata: { demo: true, financialRecordsCreated: 0 },
      targetId: "development-seed",
    },
    update: {},
    where: { id: auditId },
  });
}
