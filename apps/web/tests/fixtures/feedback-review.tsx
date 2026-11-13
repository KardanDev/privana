import type { OperationsTransactionDTO } from "@privana/api/contracts/platform";
import { buttonVariants } from "@privana/ui/components/button";
import { cn } from "@privana/ui/lib/utils";
import { useCallback, useState } from "react";
import { OperationsTransactions } from "../../src/domains/admin/operations-transactions";
import { LockedPostNotice } from "../../src/domains/posts/locked-post-notice";
import { EmptyState } from "../../src/shared/components/empty-state";
import { QueryFeedback } from "../../src/shared/components/query-feedback";
import { ReviewActions } from "./review-actions";

const transactions: OperationsTransactionDTO[] = [
  {
    amountMinor: 2990,
    createdAt: "2026-11-13T12:00:00.000Z",
    creatorId: null,
    creatorName: "Maria de Oliveira e Albuquerque",
    currency: "BRL",
    externalId: "fixture-only",
    id: "fixture-transaction",
    kind: "PAYMENT",
    occurredAt: "2026-11-13T12:00:00.000Z",
    provider: "EXEMPLO SEM COBRANÇA",
    status: "SUCCEEDED",
    subscriptionId: null,
    userId: null,
    userName: "Pessoa de exemplo",
  },
];

export function FeedbackReview() {
  const [retries, setRetries] = useState(0);
  const retry = useCallback(() => setRetries((count) => count + 1), []);
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-8">
      <header>
        <h1 className="font-semibold text-3xl">Estados em revisão</h1>
        <p className="text-muted-foreground text-sm">
          Exemplos fictícios e locais. Nenhuma ação altera contas ou pagamentos.
        </p>
      </header>
      <ReviewActions />
      <section aria-label="Recuperação de conteúdo">
        <QueryFeedback retry={retry} />
        <p className="text-muted-foreground text-sm" role="status">
          Tentativas locais: {retries}
        </p>
      </section>
      <section aria-label="Carregamento de conteúdo">
        <QueryFeedback loading />
      </section>
      <EmptyState
        description="As publicações aparecerão aqui quando você começar a salvar conteúdo."
        title="Nenhuma publicação salva neste exemplo"
      />
      <section aria-label="Acesso ao conteúdo de exemplo">
        <LockedPostNotice>
          <a
            className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
            href="/creators/perfil-ficticio"
          >
            Ver perfil do criador
          </a>
        </LockedPostNotice>
      </section>
      <section aria-label="Dados fictícios para revisão">
        <h2 className="mb-4 font-heading font-semibold text-xl">
          Registro ilustrativo, sem cobrança
        </h2>
        <OperationsTransactions items={transactions} />
      </section>
    </main>
  );
}
