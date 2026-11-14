"use client";
import { Button } from "@privana/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@privana/ui/components/empty";
import { Skeleton } from "@privana/ui/components/skeleton";
import { RefreshCw } from "lucide-react";

export function QueryFeedback({
  loading,
  retry,
}: {
  loading?: boolean;
  retry?: () => void;
}) {
  if (loading) {
    return (
      <div
        aria-label="Carregando"
        className="flex flex-col gap-6 py-6"
        role="status"
      >
        <span className="sr-only">Carregando conteúdo…</span>
        {[1, 2, 3].map((item) => (
          <div aria-hidden="true" className="flex flex-col gap-3" key={item}>
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <Empty className="min-h-64 bg-card" role="alert">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <RefreshCw aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>Não foi possível carregar agora</EmptyTitle>
        <EmptyDescription>
          Tente novamente em instantes. Suas informações continuam salvas.
        </EmptyDescription>
      </EmptyHeader>
      {retry ? (
        <EmptyContent>
          <Button onClick={retry} variant="outline">
            Tentar novamente
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  );
}
