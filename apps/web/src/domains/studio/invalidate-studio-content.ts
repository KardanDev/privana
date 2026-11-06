import type { QueryClient, QueryKey } from "@tanstack/react-query";

export async function invalidateStudioContent(
  queryClient: QueryClient,
  studioKey: QueryKey,
  creatorId?: string
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: studioKey }),
    queryClient.invalidateQueries({ queryKey: ["social-stream"] }),
    queryClient.invalidateQueries({
      queryKey: creatorId ? ["creator-posts", creatorId] : ["creator-posts"],
    }),
    queryClient.invalidateQueries({ queryKey: ["creator"] }),
    queryClient.invalidateQueries({ queryKey: ["discovery"] }),
    queryClient.invalidateQueries({ queryKey: ["creator-suggestions"] }),
  ]);
}
