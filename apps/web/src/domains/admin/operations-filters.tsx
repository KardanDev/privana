import { Button } from "@privana/ui/components/button";
import { Input } from "@privana/ui/components/input";
import { Search } from "lucide-react";
import type { FormEventHandler } from "react";
import { teamRoleLabels } from "./operations-navigation";
import type { OperationsListSection } from "./operations-types";

const statuses: Record<
  OperationsListSection,
  { value: string; label: string }[]
> = {
  audits: [],
  creators: [
    { label: "Ativos", value: "ACTIVE" },
    { label: "Em análise", value: "PENDING" },
    { label: "Suspensos", value: "SUSPENDED" },
  ],
  reports: [
    { label: "Em aberto", value: "OPEN" },
    { label: "Resolvidas", value: "RESOLVED" },
    { label: "Descartadas", value: "DISMISSED" },
  ],
  subscriptions: [
    { label: "Ativas", value: "ACTIVE" },
    { label: "Expiradas", value: "EXPIRED" },
    { label: "Revogadas", value: "REVOKED" },
    { label: "Canceladas", value: "CANCELED" },
  ],
  transactions: [
    { label: "Pendentes", value: "PENDING" },
    { label: "Confirmadas", value: "SUCCEEDED" },
    { label: "Falhas", value: "FAILED" },
  ],
  users: [
    { label: "Ativas", value: "ACTIVE" },
    { label: "Suspensas", value: "SUSPENDED" },
  ],
};

export function OperationsFiltersForm({
  section,
  onSubmit,
  onReset,
  pending,
}: {
  section: OperationsListSection;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onReset: () => void;
  pending: boolean;
}) {
  return (
    <form
      aria-label="Filtrar registros"
      className="flex flex-wrap items-end gap-3 rounded-xl border bg-card p-4"
      onReset={onReset}
      onSubmit={onSubmit}
    >
      <label
        className="flex min-w-44 flex-1 flex-col gap-1.5 text-xs"
        htmlFor="operations-search"
      >
        Buscar
        <Input
          id="operations-search"
          maxLength={120}
          name="search"
          placeholder={
            section === "audits"
              ? "Ação, responsável ou registro"
              : "Nome, e-mail ou identificador"
          }
          type="search"
        />
      </label>
      {statuses[section].length > 0 ? (
        <label className="flex min-w-36 flex-col gap-1.5 text-xs">
          Situação
          <select
            className="h-11 rounded-lg border bg-background px-3 text-sm"
            name="status"
          >
            <option value="">Todas</option>
            {statuses[section].map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {section === "users" ? (
        <label className="flex min-w-36 flex-col gap-1.5 text-xs">
          Papel
          <select
            className="h-11 rounded-lg border bg-background px-3 text-sm"
            name="role"
          >
            <option value="">Todos</option>
            {Object.entries(teamRoleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {section === "transactions" ? (
        <>
          <label
            className="flex w-24 flex-col gap-1.5 text-xs"
            htmlFor="operations-currency"
          >
            Moeda ISO
            <Input
              id="operations-currency"
              maxLength={3}
              name="currency"
              pattern="[A-Za-z]{3}"
              placeholder="BRL"
            />
          </label>
          <label className="flex min-w-32 flex-col gap-1.5 text-xs">
            Tipo
            <select
              className="h-11 rounded-lg border bg-background px-3 text-sm"
              name="kind"
            >
              <option value="">Todos</option>
              <option value="CHARGE">Cobrança</option>
              <option value="REFUND">Reembolso</option>
            </select>
          </label>
        </>
      ) : null}
      <Button disabled={pending} type="submit" variant="outline">
        <Search data-icon="inline-start" />
        Filtrar
      </Button>
      <Button disabled={pending} type="reset" variant="ghost">
        Limpar filtros
      </Button>
    </form>
  );
}
