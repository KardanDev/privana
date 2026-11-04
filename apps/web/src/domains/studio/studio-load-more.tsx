import { Button } from "@privana/ui/components/button";

export function StudioLoadMore({
  error,
  hasMore,
  pending,
  onLoad,
}: {
  error: boolean;
  hasMore: boolean;
  pending: boolean;
  onLoad: () => void;
}) {
  if (!(hasMore || error)) {
    return null;
  }
  return (
    <div className="flex flex-col items-center gap-3">
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          Não foi possível carregar mais publicações. Suas publicações
          carregadas continuam disponíveis.
        </p>
      ) : null}
      <Button disabled={pending} onClick={onLoad} variant="outline">
        {pending ? "Carregando…" : "Ver mais publicações"}
      </Button>
    </div>
  );
}
