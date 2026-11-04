import { AdminReportRow } from "./admin-report-row";
import type { AdminActionProps, AdminOverview } from "./admin-types";

export function AdminReports({
  reports,
  creators,
  onAction,
  pending,
}: AdminActionProps & {
  reports: AdminOverview["reports"];
  creators: AdminOverview["creators"];
}) {
  const creatorsById = new Map(
    creators.map((creator) => [creator.id, creator])
  );
  return (
    <ul className="divide-y rounded-2xl border bg-card">
      {reports.map((report) => (
        <AdminReportRow
          creator={
            report.creatorId ? creatorsById.get(report.creatorId) : undefined
          }
          key={report.id}
          onAction={onAction}
          pending={pending}
          report={report}
        />
      ))}
    </ul>
  );
}
