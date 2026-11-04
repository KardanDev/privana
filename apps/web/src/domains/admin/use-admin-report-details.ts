"use client";

import { useQuery } from "@tanstack/react-query";
import { client } from "@/utils/orpc";

export function useAdminReportDetails(id: string) {
  return useQuery({
    gcTime: 0,
    queryFn: () => client.admin.reportDetails({ id }),
    queryKey: ["admin-report-details", id],
    retry: false,
  });
}
