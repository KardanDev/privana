import type { Prisma } from "../../prisma/generated/client";
import { assertDemoRecordOwner } from "./assert-demo-record-owner";
import type { DemoCreatorDefinition } from "./definitions";

const JOURNAL = [
  {
    body: "Estou preparando uma série nova e quis mostrar o primeiro registro. Ainda faltam alguns detalhes, mas essa é a parte de que mais gosto: experimentar até encontrar o tom certo.",
    title: "Um pouco do que vem por aí",
  },
  {
    body: "Um caderno aberto, uma playlist nova e algumas imagens que guardei durante a semana. São essas pequenas coleções que acabam virando ideias maiores. Vocês também têm esse hábito?",
    title: "As referências desta semana",
  },
  {
    body: "Li as sugestões que chegaram por aqui e separei um momento para responder. Adoro quando uma conversa vira uma ideia nova. Obrigada por participarem tão de perto.",
    title: "Vocês escolheram, eu preparei",
  },
  {
    body: "Uma seleção com o processo completo, as tentativas e os detalhes que normalmente não aparecem. Gosto de dividir o caminho inteiro com quem acompanha meu trabalho de perto.",
    title: "Bastidores: do início ao resultado",
  },
  {
    body: "Hoje foi dia de organizar referências e planejar as próximas publicações. Deixei espaço para improvisar, porque algumas das melhores ideias aparecem no meio do caminho.",
    title: "Meu caderno de ideias",
  },
  {
    body: "Às vezes vale parar para olhar de novo. Esse registro ficou guardado por alguns dias e agora encontrei o momento certo de compartilhar. Me contem o que chamou a atenção de vocês.",
    title: "De perto, com calma",
  },
  {
    body: "Passei para agradecer a companhia desta semana. Estou lendo as mensagens e separando perguntas para a próxima publicação. Deixem aqui o que gostariam de ver mais por aqui.",
    title: "Uma conversa para o fim de semana",
  },
  {
    body: "Rascunho de uma ideia para a próxima semana. Vou reunir as referências e revisar os detalhes antes de publicar.",
    title: "Próximo capítulo",
  },
  {
    body: "Uma publicação anterior guardada no arquivo. Ela fica disponível no estúdio para revisão e organização do conteúdo.",
    title: "Do arquivo pessoal",
  },
];

export async function seedCreatorHistory(
  tx: Prisma.TransactionClient,
  creator: DemoCreatorDefinition,
  creatorId: string,
  index: number,
  now: Date
): Promise<void> {
  await Promise.all(
    JOURNAL.map(async (entry, position) => {
      const id = `demo-history-${creator.handle}-${position}`;
      assertDemoRecordOwner(await tx.post.findUnique({ where: { id } }), {
        creatorId,
      });
      const draft = position === 7 || creator.status === "PENDING";
      const archived = position === 8 && !draft;
      let status = "PUBLISHED";
      if (archived) {
        status = "ARCHIVED";
      }
      if (draft) {
        status = "DRAFT";
      }
      const premium = position === 3 || position === 5;
      await tx.post.upsert({
        create: {
          body: entry.body,
          createdAt: new Date(
            now.getTime() - (position * 36 + index * 3 + 1) * 3_600_000
          ),
          creatorId,
          excerpt: premium
            ? "Entre nos bastidores e acompanhe o processo completo."
            : entry.body.slice(0, 140),
          id,
          previewUrl:
            !premium && position % 3 !== 1
              ? `https://images.unsplash.com/${creator.cover}?auto=format&fit=crop&w=1200&q=80`
              : null,
          status,
          title: entry.title,
          visibility: premium ? "SUBSCRIBERS" : "PUBLIC",
        },
        update: {},
        where: { id },
      });
    })
  );
}
