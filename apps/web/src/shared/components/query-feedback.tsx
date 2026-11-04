"use client";
import { Button } from "@privana/ui/components/button";
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
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        role="status"
      >
        {[1, 2, 3].map((item) => (
          <Skeleton className="h-72 rounded-2xl" key={item} />
        ))}
      </div>
    );
  }
  return (
    <div
      className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-2xl border bg-card p-8 text-center"
      role="alert"
    >
      <RefreshCw aria-hidden="true" className="size-7 text-primary" />
      <h2 className="font-semibold">Não foi possível carregar agora</h2>
      <p className="max-w-sm text-muted-foreground text-sm">
        Tente novamente em instantes. Suas informações continuam salvas.
      </p>
      {retry ? (
        <Button onClick={retry} variant="outline">
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}
