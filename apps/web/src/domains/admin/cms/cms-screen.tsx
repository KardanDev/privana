"use client";

import { useQuery } from "@tanstack/react-query";
import { QueryFeedback } from "@/shared/components/query-feedback";
import { client } from "@/utils/orpc";
import { CmsWorkspace } from "./cms-workspace";

export function CmsScreen() {
  const query = useQuery({
    gcTime: 0,
    queryFn: () => client.admin.cms.get(),
    queryKey: ["admin-cms"],
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
  });
  if (query.isPending) {
    return <QueryFeedback loading />;
  }
  if (query.isError) {
    return <QueryFeedback retry={query.refetch} />;
  }
  return <CmsWorkspace document={query.data} key={query.data.version} />;
}
