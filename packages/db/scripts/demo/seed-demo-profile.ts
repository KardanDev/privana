import type { Prisma } from "../../prisma/generated/client";
import { assertDemoRecordOwner } from "./assert-demo-record-owner";
import type { DemoCreatorDefinition } from "./definitions";
export async function seedDemoProfile(
  tx: Prisma.TransactionClient,
  creator: DemoCreatorDefinition,
  index: number,
  now: Date
) {
  const [existing, handleOwner] = await Promise.all([
    tx.creatorProfile.findUnique({ where: { userId: creator.userId } }),
    tx.creatorProfile.findUnique({ where: { handle: creator.handle } }),
  ]);
  assertDemoRecordOwner(existing, { isDemo: true, userId: creator.userId });
  if (handleOwner && handleOwner.userId !== creator.userId) {
    throw new Error(
      "O identificador de criador reservado já está em uso. Operação cancelada."
    );
  }
  const profile = await tx.creatorProfile.upsert({
    create: {
      avatarUrl: `https://images.unsplash.com/${creator.photo}?auto=format&fit=crop&w=400&q=80`,
      bio: `DEMONSTRAÇÃO · ${creator.bio}`,
      category: creator.category,
      coverUrl: `https://images.unsplash.com/${creator.cover}?auto=format&fit=crop&w=1400&q=80`,
      createdAt: new Date(now.getTime() - (index + 5) * 86_400_000),
      displayName: creator.name,
      handle: creator.handle,
      id: `demo-profile-${creator.handle}`,
      isDemo: true,
      location: creator.location,
      monthlyPriceCents: creator.price,
      status: creator.status,
      userId: creator.userId,
    },
    update: {},
    where: { userId: creator.userId },
  });
  await tx.user.updateMany({
    data: { image: profile.avatarUrl },
    where: { id: creator.userId, image: null },
  });
  const publicPostId = `demo-public-${creator.handle}`;
  const premiumPostId = `demo-premium-${creator.handle}`;
  const posts = [
    {
      ageHours: 24 + index * 11,
      body: `DEMONSTRAÇÃO\n\n${creator.story}`,
      excerpt: "DEMONSTRAÇÃO · Uma amostra do universo deste criador.",
      id: publicPostId,
      photo: creator.cover,
      status: creator.status === "ACTIVE" ? "PUBLISHED" : "DRAFT",
      title: creator.title,
      visibility: "PUBLIC",
    },
    {
      ageHours: 3 + index * 7,
      body: `DEMONSTRAÇÃO\n\nEste espaço reúne referências e conversas sobre ${creator.category.toLocaleLowerCase("pt-BR")}. Todo o conteúdo deste perfil é um exemplo local para explorar a plataforma, sem atividade comercial real.`,
      excerpt:
        "DEMONSTRAÇÃO · Referências, escolhas e pequenos bastidores da semana.",
      id: `demo-journal-${creator.handle}`,
      photo: creator.cover,
      status: creator.status === "ACTIVE" ? "PUBLISHED" : "DRAFT",
      title: "Entre uma ideia e outra",
      visibility: "PUBLIC",
    },
    {
      ageHours: 8 + index * 9,
      body: "DEMONSTRAÇÃO · Material de exemplo reservado ao criador e à equipe de moderação. Nenhuma compra ou assinatura foi criada para liberar este conteúdo.",
      excerpt:
        "DEMONSTRAÇÃO · Prévia exclusiva. Pagamentos e assinaturas reais ainda não estão disponíveis.",
      id: premiumPostId,
      photo: null,
      status: creator.status === "ACTIVE" ? "PUBLISHED" : "DRAFT",
      title: "Nos bastidores do processo",
      visibility: "SUBSCRIBERS",
    },
  ];
  if (index === 0) {
    posts.push({
      ageHours: 1,
      body: "DEMONSTRAÇÃO · Este rascunho serve para testar edição, publicação e arquivamento no estúdio.",
      excerpt: "DEMONSTRAÇÃO · Rascunho visível apenas no estúdio.",
      id: "demo-draft-luna",
      photo: null,
      status: "DRAFT",
      title: "Uma ideia para a próxima publicação",
      visibility: "PUBLIC",
    });
  }
  await Promise.all(
    posts.map(async (post) => {
      assertDemoRecordOwner(
        await tx.post.findUnique({ where: { id: post.id } }),
        { creatorId: profile.id }
      );
      const { photo, ageHours, ...data } = post;
      await tx.post.upsert({
        create: {
          ...data,
          createdAt: new Date(now.getTime() - ageHours * 3_600_000),
          creatorId: profile.id,
          previewUrl: photo
            ? `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=1200&q=80`
            : null,
        },
        update: {},
        where: { id: post.id },
      });
    })
  );
  return { premiumPostId, profile, publicPostId };
}
