import { cn } from "@privana/ui/lib/utils";

const labels: Record<string, string> = {
  ACTIVE: "Ativo",
  CANCELED: "Cancelado",
  DISMISSED: "Descartada",
  EXPIRED: "Expirado",
  FAILED: "Falha",
  OPEN: "Em aberto",
  PENDING: "Em análise",
  RESOLVED: "Resolvida",
  REVOKED: "Revogado",
  SUCCEEDED: "Confirmada",
  SUSPENDED: "Suspenso",
};

export function AdminStatus({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center rounded-full border px-2.5 py-1 font-medium text-[11px]",
        status === "ACTIVE" || status === "RESOLVED"
          ? "border-primary/15 bg-accent text-primary"
          : "bg-muted text-muted-foreground",
        status === "SUSPENDED" &&
          "border-destructive/15 bg-destructive/5 text-destructive"
      )}
    >
      {labels[status] ?? status}
    </span>
  );
}
