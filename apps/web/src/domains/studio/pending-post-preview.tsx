import { LoaderCircle } from "lucide-react";

export function PendingPostPreview({
  title,
  phase,
  published,
}: {
  title: string;
  phase: "uploading" | "saving";
  published: boolean;
}) {
  const message =
    phase === "uploading"
      ? "Enviando e verificando seu arquivo…"
      : "Aguardando confirmação do servidor…";
  return (
    <div
      className="flex items-start gap-3 rounded-lg border bg-accent p-4 text-sm"
      role="status"
    >
      <LoaderCircle
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 animate-spin text-primary"
      />
      <div className="min-w-0">
        <p className="truncate font-medium">{title || "Sua publicação"}</p>
        <p className="mt-1 text-muted-foreground">{message}</p>
        <p className="mt-1 text-muted-foreground text-xs">
          {published
            ? "A publicação só fica disponível após a confirmação."
            : "Seu rascunho está sendo salvo."}
        </p>
      </div>
    </div>
  );
}
