import type { QueryClient } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

export async function refreshOperations(
  queryClient: QueryClient,
  publicContent = false
): Promise<void> {
  const keys: readonly unknown[][] = [
    ["admin-operations"],
    ["admin-analytics"],
    ["admin-report-details"],
    ...(publicContent
      ? [
          ["social-stream"],
          ["creator"],
          ["creator-posts"],
          ["discovery"],
          ["creator-suggestions"],
          ["memberships"],
          orpc.studio.overview.key(),
          orpc.viewer.get.key(),
        ]
      : []),
  ];
  await Promise.all(
    keys.map(
      async (queryKey) => await queryClient.invalidateQueries({ queryKey })
    )
  );
}
