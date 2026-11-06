import type { PostDTO } from "@privana/api/contracts/product";
import type { QueryClient, QueryKey } from "@tanstack/react-query";
import type { StudioCache, StudioCacheSnapshot } from "./studio-cache-types";

export function archiveStudioCache(
  queryClient: QueryClient,
  queryKey: QueryKey,
  post: PostDTO
): StudioCacheSnapshot[] {
  if (post.status === "ARCHIVED") {
    return [];
  }
  const snapshots: StudioCacheSnapshot[] = [];
  for (const [key, data] of queryClient.getQueriesData<StudioCache>({
    queryKey,
  })) {
    if (!data?.pages.some((page) => page.profile?.id === post.creator.id)) {
      continue;
    }
    snapshots.push({ data, key });
    queryClient.setQueryData<StudioCache>(key, {
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        metrics: {
          ...page.metrics,
          posts: Math.max(0, page.metrics.posts - 1),
        },
        posts: page.posts.filter((entry) => entry.id !== post.id),
      })),
    });
  }
  return snapshots;
}
