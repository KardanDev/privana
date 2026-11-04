import type { OperationsSubscriptionDTO } from "@privana/api/contracts/platform";
import { formatDate } from "@/shared/formatting/format-date";
import { AdminStatus } from "./admin-status";
import { RevokeAccessForm } from "./revoke-access-form";

export function OperationsSubscriptions({
  items,
  canRevoke,
}: {
  items: OperationsSubscriptionDTO[];
  canRevoke: boolean;
}) {
  return (
    <ul className="divide-y rounded-xl border bg-card">
      {items.map((item) => (
        <li className="p-4" key={item.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-medium text-sm">
                {item.userName}{" "}
                <span className="font-normal text-muted-foreground">
                  → {item.creatorName}
                </span>
              </h2>
              <p className="mt-1 break-all text-muted-foreground text-xs">
                {item.userEmail}
              </p>
              <p className="mt-2 text-muted-foreground text-xs">
                Criada em {formatDate(item.createdAt)} · Validade até{" "}
                {formatDate(item.expiresAt)}
              </p>
              <p className="mt-1 break-all text-[11px] text-muted-foreground">
                ID: {item.id}
              </p>
            </div>
            <AdminStatus status={item.status} />
          </div>
          {canRevoke && item.status === "ACTIVE" ? (
            <RevokeAccessForm id={item.id} />
          ) : null}
        </li>
      ))}
    </ul>
  );
}
