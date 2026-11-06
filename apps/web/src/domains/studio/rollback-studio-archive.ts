import type { PostDTO } from "@privana/api/contracts/product";
import type { QueryClient } from "@tanstack/react-query";
import type { StudioCache, StudioCacheSnapshot } from "./studio-cache-types";

export function rollbackStudioArchive(
  queryClient: QueryClient,
  snapshots: StudioCacheSnapshot[],
  post: PostDTO
): void {
  for (const { data, key } of snapshots) {
    queryClient.setQueryData<StudioCache>(key, (current) => {
      if (!current) {
        return data;
      }
      return {
        ...current,
        pages: current.pages.map((page, pageIndex) => {
          const previousPosts = data.pages[pageIndex]?.posts ?? [];
          const position = previousPosts.findIndex(
            (entry) => entry.id === post.id
          );
          const posts = [...page.posts];
          if (position !== -1 && !posts.some((entry) => entry.id === post.id)) {
            posts.splice(Math.min(position, posts.length), 0, post);
          }
          return {
            ...page,
            metrics: {
              ...page.metrics,
              posts:
                page.metrics.posts +
                (data.pages[pageIndex]?.metrics.posts ? 1 : 0),
            },
            posts,
          };
        }),
      };
    });
  }
}
