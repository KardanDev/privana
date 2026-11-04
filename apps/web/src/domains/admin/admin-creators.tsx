import { Button } from "@privana/ui/components/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/shared/components/avatar";
import { AdminActionButton } from "./admin-action-button";
import { AdminStatus } from "./admin-status";
import type { AdminActionProps, AdminOverview } from "./admin-types";

export function AdminCreators({
  creators,
  onAction,
  pending,
  viewerId,
}: AdminActionProps & {
  creators: AdminOverview["creators"];
  viewerId: string;
}) {
  return (
    <ul className="divide-y rounded-2xl border bg-card">
      {creators.map((creator) => (
        <li
          className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
          key={creator.id}
        >
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name={creator.displayName} src={creator.avatarUrl} />
            <div className="min-w-0">
              <p className="break-words font-semibold text-sm">
                {creator.displayName}
              </p>
              <p className="break-all text-muted-foreground text-xs">
                @{creator.handle} · {creator.category}
              </p>
              <p className="mt-2 break-all text-[11px] text-muted-foreground">
                ID: {creator.id}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AdminStatus status={creator.status} />
            {creator.status === "ACTIVE" ? (
              <Button
                aria-label={`Ver perfil de ${creator.displayName}`}
                nativeButton={false}
                render={<Link href={`/creators/${creator.handle}`} />}
                size="sm"
                variant="ghost"
              >
                Ver perfil
                <ArrowUpRight aria-hidden="true" />
              </Button>
            ) : null}
            {creator.status === "ACTIVE" ? null : (
              <AdminActionButton
                command={{
                  id: creator.id,
                  kind: "creator",
                  name: creator.displayName,
                  status: "ACTIVE",
                }}
                onAction={onAction}
                pending={pending}
              >
                {creator.status === "PENDING" ? "Aprovar" : "Reativar"}
              </AdminActionButton>
            )}
            {creator.status !== "SUSPENDED" && creator.userId !== viewerId ? (
              <AdminActionButton
                command={{
                  id: creator.id,
                  kind: "creator",
                  name: creator.displayName,
                  status: "SUSPENDED",
                }}
                onAction={onAction}
                pending={pending}
                variant="destructive"
              >
                Suspender
              </AdminActionButton>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
