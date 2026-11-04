import { EmptyState } from "@/shared/components/empty-state";
import { AdminAudits } from "./admin-audits";
import { AdminCreators } from "./admin-creators";
import { AdminReports } from "./admin-reports";
import type { AdminActionProps } from "./admin-types";
import { OperationsSubscriptions } from "./operations-subscriptions";
import { OperationsTransactions } from "./operations-transactions";
import type { OperationsResult } from "./operations-types";
import { OperationsUsers } from "./operations-users";

export function OperationsResults({
  result,
  onAction,
  pending,
  viewerId,
  viewerRole,
}: AdminActionProps & {
  result: OperationsResult;
  viewerId: string;
  viewerRole: string;
}) {
  if (result.data.items.length === 0) {
    return (
      <EmptyState
        description="Nenhum registro corresponde aos filtros atuais. Nenhum dado de demonstração é adicionado automaticamente."
        title="Nenhum registro encontrado"
      />
    );
  }
  if (result.section === "users") {
    return (
      <OperationsUsers
        onAction={onAction}
        pending={pending}
        users={result.data.items}
        viewerId={viewerId}
        viewerRole={viewerRole}
      />
    );
  }
  if (result.section === "creators") {
    return (
      <AdminCreators
        creators={result.data.items}
        onAction={onAction}
        pending={pending}
        viewerId={viewerId}
      />
    );
  }
  if (result.section === "reports") {
    return (
      <AdminReports
        creators={[]}
        onAction={onAction}
        pending={pending}
        reports={result.data.items}
      />
    );
  }
  if (result.section === "audits") {
    return <AdminAudits audits={result.data.items} />;
  }
  if (result.section === "subscriptions") {
    return (
      <OperationsSubscriptions
        canRevoke={viewerRole === "admin"}
        items={result.data.items}
      />
    );
  }
  return <OperationsTransactions items={result.data.items} />;
}
