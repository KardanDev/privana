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
        "inline-flex w-fit items-center rounded-full px-2.5 py-1 font-medium text-sm",
        ["ACTIVE", "RESOLVED", "SUCCEEDED"].includes(status)
          ? "bg-success-surface text-success"
          : "bg-muted text-muted-foreground",
        ["FAILED", "SUSPENDED"].includes(status) &&
          "bg-destructive-surface text-destructive",
        ["OPEN", "PENDING"].includes(status) &&
          "bg-warning-surface text-warning"
      )}
    >
      {labels[status] ?? status}
    </span>
  );
}
