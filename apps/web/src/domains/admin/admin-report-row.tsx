import Link from "next/link";
import { formatDate } from "@/shared/formatting/format-date";
import { AdminActionButton } from "./admin-action-button";
import { AdminReportDetails } from "./admin-report-details";
import { AdminStatus } from "./admin-status";
import type { AdminActionProps, AdminOverview } from "./admin-types";

export function AdminReportRow({
  report,
  creator,
  onAction,
  pending,
}: AdminActionProps & {
  report: AdminOverview["reports"][number];
  creator?: AdminOverview["creators"][number];
}) {
  return (
    <li className="flex flex-col gap-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-muted-foreground text-xs">
          Recebida em {formatDate(report.createdAt)}
        </span>
        <AdminStatus status={report.status} />
      </div>
      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed [overflow-wrap:anywhere]">
        {report.reason}
      </p>
      <dl className="grid gap-2 text-muted-foreground text-xs sm:grid-cols-2">
        <div>
          <dt>Denúncia</dt>
          <dd className="mt-1 break-all font-mono text-[11px]">{report.id}</dd>
        </div>
        <div>
          <dt>Enviada por</dt>
          <dd className="mt-1 break-all font-mono text-[11px]">
            {report.reporterId}
          </dd>
        </div>
        {report.creatorId ? (
          <div>
            <dt>Criador</dt>
            <dd className="mt-1 break-all">
              {creator?.status === "ACTIVE" ? (
                <Link
                  className="text-primary underline underline-offset-4"
                  href={`/creators/${creator.handle}`}
                >
                  @{creator.handle}
                </Link>
              ) : (
                report.creatorId
              )}
            </dd>
          </div>
        ) : null}
        {report.postId ? (
          <div>
            <dt>Publicação (ID)</dt>
            <dd className="mt-1 break-all font-mono text-[11px]">
              {report.postId}
            </dd>
          </div>
        ) : null}
      </dl>
      <AdminReportDetails reportId={report.id} />
      {report.resolvedAt ? (
        <p className="text-muted-foreground text-xs">
          Analisada em {formatDate(report.resolvedAt)}
        </p>
      ) : null}
      {report.status === "OPEN" ? (
        <div className="flex flex-wrap gap-2 border-t pt-4">
          <AdminActionButton
            command={{
              id: report.id,
              kind: "report",
              name: report.id,
              status: "RESOLVED",
            }}
            onAction={onAction}
            pending={pending}
            variant="default"
          >
            Marcar como resolvida
          </AdminActionButton>
          <AdminActionButton
            command={{
              id: report.id,
              kind: "report",
              name: report.id,
              status: "DISMISSED",
            }}
            onAction={onAction}
            pending={pending}
          >
            Descartar denúncia
          </AdminActionButton>
          <p className="w-full text-[11px] text-muted-foreground">
            Encerrar a análise mantém o histórico. Para suspender um perfil ou
            conta, use a seção correspondente.
          </p>
        </div>
      ) : null}
    </li>
  );
}
