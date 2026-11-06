"use client";

import { Button } from "@privana/ui/components/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { QueryFeedback } from "@/shared/components/query-feedback";
import { AdminConfirmation } from "./admin-confirmation";
import { OperationsFiltersForm } from "./operations-filters";
import { OperationsResults } from "./operations-results";
import type { OperationsListSection } from "./operations-types";
import { useAdminActions } from "./use-admin-actions";
import { useOperationsList } from "./use-operations-list";

export function OperationsList({
  section,
  viewerId,
  viewerRole,
}: {
  section: OperationsListSection;
  viewerId: string;
  viewerRole: string;
}) {
  const state = useOperationsList(section);
  const actions = useAdminActions();
  const { query } = state;
  return (
    <div
      aria-busy={query.isFetching || actions.pending}
      className="flex flex-col gap-4"
    >
      <OperationsFiltersForm
        onReset={state.reset}
        onSubmit={state.search}
        pending={query.isFetching || actions.pending}
        section={section}
      />
      {section === "transactions" ? (
        <p className="text-muted-foreground text-xs">
          Consulta de eventos verificados. Esta área não cria cobranças,
          cancelamentos ou reembolsos.
        </p>
      ) : null}
      {section === "subscriptions" ? (
        <p className="text-muted-foreground text-xs">
          Gerenciamento do acesso local ao conteúdo. Ações financeiras são
          independentes.
        </p>
      ) : null}
      {actions.pending ? (
        <p className="text-primary text-sm" role="status">
          Salvando alteração…
        </p>
      ) : null}
      {query.isFetching && !query.isPending && !actions.pending ? (
        <p className="text-muted-foreground text-sm" role="status">
          Atualizando registros…
        </p>
      ) : null}
      {actions.error && !actions.confirmation ? (
        <p className="text-destructive text-sm" role="alert">
          A alteração não foi salva. Verifique seu acesso e tente novamente.
        </p>
      ) : null}
      {query.isPending ? <QueryFeedback loading /> : null}
      {query.isError ? <QueryFeedback retry={query.refetch} /> : null}
      {query.data && !query.isError ? (
        <OperationsResults
          onAction={actions.onAction}
          pending={actions.pending || query.isFetching}
          result={query.data}
          viewerId={viewerId}
          viewerRole={viewerRole}
        />
      ) : null}
      <nav
        aria-label="Paginação de registros"
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <p className="text-muted-foreground text-xs">
          Página {state.filters.page + 1}
          {query.data
            ? ` · ${query.data.data.total.toLocaleString("pt-BR")} registros encontrados`
            : ""}
        </p>
        <div className="flex gap-2">
          <Button
            disabled={
              state.filters.page === 0 || query.isFetching || actions.pending
            }
            onClick={state.previous}
            size="sm"
            variant="outline"
          >
            <ArrowLeft data-icon="inline-start" />
            Anterior
          </Button>
          <Button
            disabled={
              !query.data?.data.hasMore || query.isFetching || actions.pending
            }
            onClick={state.next}
            size="sm"
            variant="outline"
          >
            Próxima
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </nav>
      <AdminConfirmation
        command={actions.confirmation}
        error={actions.error}
        onCancel={actions.cancel}
        onConfirm={actions.confirm}
        pending={actions.pending}
      />
    </div>
  );
}
