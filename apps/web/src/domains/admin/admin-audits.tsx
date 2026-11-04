import { History } from "lucide-react";
import { formatDate } from "@/shared/formatting/format-date";
import type { AdminOverview } from "./admin-types";

const actionLabels: Record<string, string> = {
  CMS_DRAFT_RESTORED: "Versão restaurada ao rascunho",
  CMS_DRAFT_SAVED: "Rascunho da plataforma salvo",
  CMS_PUBLISHED: "Configuração da plataforma publicada",
  CREATOR_STATUS_CHANGED: "Situação do criador alterada",
  LOCAL_SUBSCRIPTION_ACCESS_REVOKED: "Acesso de assinatura revogado",
  REPORT_RESOLVED: "Denúncia analisada",
  TEAM_ROLE_CHANGED: "Papel da equipe alterado",
  USER_STATUS_CHANGED: "Situação da conta alterada",
};

export function AdminAudits({
  audits,
}: {
  audits: (AdminOverview["audits"][number] & { actorName?: string })[];
}) {
  return (
    <ol className="divide-y rounded-2xl border bg-card">
      {audits.map((audit) => (
        <li className="flex gap-3 p-5" key={audit.id}>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
            <History aria-hidden="true" className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="break-words font-medium text-sm">
                {actionLabels[audit.action] ?? audit.action}
              </p>
              <time
                className="text-muted-foreground text-xs"
                dateTime={audit.createdAt}
              >
                {formatDate(audit.createdAt)}
              </time>
            </div>
            <dl className="mt-3 grid gap-2 text-muted-foreground text-xs sm:grid-cols-2">
              <div>
                <dt>Responsável (ID)</dt>
                <dd className="mt-1 break-all font-mono text-[11px]">
                  {audit.actorName
                    ? `${audit.actorName} · ${audit.actorId}`
                    : audit.actorId}
                </dd>
              </div>
              <div>
                <dt>Registro alterado (ID)</dt>
                <dd className="mt-1 break-all font-mono text-[11px]">
                  {audit.targetId}
                </dd>
              </div>
            </dl>
          </div>
        </li>
      ))}
    </ol>
  );
}
