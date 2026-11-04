"use client";

import { Button } from "@privana/ui/components/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AdminReportInspection } from "./admin-report-inspection";
import { useReportExpansion } from "./use-report-expansion";

export function AdminReportDetails({ reportId }: { reportId: string }) {
  const expansion = useReportExpansion();
  return (
    <div className="rounded-xl border bg-background/50 p-4">
      <Button
        aria-controls={`report-details-${reportId}`}
        aria-expanded={expansion.open}
        onClick={expansion.toggle}
        size="sm"
        variant="ghost"
      >
        {expansion.open ? (
          <ChevronUp aria-hidden="true" />
        ) : (
          <ChevronDown aria-hidden="true" />
        )}
        {expansion.open
          ? "Fechar conteúdo denunciado"
          : "Inspecionar conteúdo denunciado"}
      </Button>
      <div id={`report-details-${reportId}`}>
        {expansion.open ? <AdminReportInspection reportId={reportId} /> : null}
      </div>
    </div>
  );
}
