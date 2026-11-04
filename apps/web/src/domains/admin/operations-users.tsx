import type { OperationsUserDTO } from "@privana/api/contracts/platform";
import { formatDate } from "@/shared/formatting/format-date";
import { AdminActionButton } from "./admin-action-button";
import { AdminStatus } from "./admin-status";
import type { AdminActionProps } from "./admin-types";
import { teamRoleLabels } from "./operations-navigation";
import { TeamRoleForm } from "./team-role-form";

export function OperationsUsers({
  users,
  viewerId,
  viewerRole,
  onAction,
  pending,
}: AdminActionProps & {
  users: OperationsUserDTO[];
  viewerId: string;
  viewerRole: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full min-w-[620px] text-left text-sm">
        <caption className="sr-only">Contas e papéis de acesso</caption>
        <thead className="border-b bg-muted/40 text-xs">
          <tr>
            {[
              "Pessoa",
              "Papel e situação",
              "Acesso",
              ...(viewerRole === "admin" ? ["Equipe"] : []),
            ].map((label) => (
              <th className="px-4 py-3 font-medium" key={label} scope="col">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-4">
                <p className="font-medium">
                  {user.name}
                  {user.id === viewerId ? " (você)" : ""}
                </p>
                <p className="mt-1 break-all text-muted-foreground text-xs">
                  {user.email}
                </p>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Desde {formatDate(user.createdAt)} · E-mail{" "}
                  {user.emailVerified ? "verificado" : "não verificado"}
                </p>
              </td>
              <td className="px-4 py-4">
                <p className="mb-2 text-xs">
                  {teamRoleLabels[user.role] ?? user.role}
                </p>
                <AdminStatus status={user.status} />
              </td>
              <td className="px-4 py-4">
                {(user.role === "member" || user.role === "creator") &&
                user.id !== viewerId ? (
                  <AdminActionButton
                    command={{
                      id: user.id,
                      kind: "user",
                      name: user.name,
                      status:
                        user.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED",
                    }}
                    onAction={onAction}
                    pending={pending}
                    variant={
                      user.status === "SUSPENDED" ? "outline" : "destructive"
                    }
                  >
                    {user.status === "SUSPENDED" ? "Reativar" : "Suspender"}
                  </AdminActionButton>
                ) : (
                  <span className="text-muted-foreground text-xs">
                    Conta da equipe protegida
                  </span>
                )}
              </td>
              {viewerRole === "admin" ? (
                <td className="min-w-64 px-4 py-4">
                  <TeamRoleForm user={user} viewerId={viewerId} />
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
