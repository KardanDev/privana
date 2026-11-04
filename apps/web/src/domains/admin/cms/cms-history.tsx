"use client";

import { Button } from "@privana/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import { type MouseEventHandler, useCallback } from "react";
import { formatDate } from "@/shared/formatting/format-date";
import { client } from "@/utils/orpc";

export function CmsHistory({
  disabled,
  onRestore,
}: {
  disabled: boolean;
  onRestore: MouseEventHandler<HTMLButtonElement>;
}) {
  const query = useQuery({
    queryFn: () => client.admin.cms.history(),
    queryKey: ["admin-cms-history"],
    retry: false,
  });
  const { refetch } = query;
  const retry = useCallback(() => refetch(), [refetch]);
  return (
    <section className="rounded-xl border bg-card p-5">
      <h2 className="font-semibold text-base">Histórico de publicações</h2>
      <p className="mt-2 text-muted-foreground text-xs">
        Últimas 30 versões publicadas. Restaurar cria um novo rascunho; é
        necessário publicá-lo para alterar o site. Salve alterações locais antes
        de restaurar.
      </p>
      {query.isPending ? (
        <p className="mt-4 text-muted-foreground text-xs" role="status">
          Carregando versões…
        </p>
      ) : null}
      {query.isError ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="text-destructive text-xs" role="alert">
            Não foi possível carregar o histórico.
          </p>
          <Button onClick={retry} size="sm" variant="outline">
            Tentar novamente
          </Button>
        </div>
      ) : null}
      {query.data?.length === 0 ? (
        <p className="mt-4 text-muted-foreground text-sm">
          Nenhuma versão foi publicada ainda.
        </p>
      ) : null}
      <ol className="mt-4 divide-y">
        {query.data?.map((revision) => (
          <li
            className="flex flex-wrap items-center justify-between gap-3 py-3"
            key={revision.id}
          >
            <div>
              <p className="font-medium text-sm">Versão {revision.version}</p>
              <p className="mt-1 text-muted-foreground text-xs">
                {revision.publisherName} · {formatDate(revision.publishedAt)}
              </p>
            </div>
            <Button
              disabled={disabled}
              onClick={onRestore}
              size="sm"
              type="button"
              value={revision.id}
              variant="outline"
            >
              Restaurar ao rascunho
            </Button>
          </li>
        ))}
      </ol>
    </section>
  );
}
