import type { PostDTO } from "@privana/api/contracts/product";
import type { QueryClient, QueryKey } from "@tanstack/react-query";
import { acceptsStudioPost } from "./accepts-studio-post";
import type { readPostForm } from "./read-post-form";
import type { StudioCache } from "./studio-cache-types";

export function commitStudioPost(
  queryClient: QueryClient,
  studioKey: QueryKey,
  saved: {
    content: ReturnType<typeof readPostForm>;
    id: string;
    mediaType?: string;
  },
  previous?: PostDTO
): void {
  const entries = queryClient.getQueriesData<StudioCache>({
    queryKey: studioKey,
  });
  // A save whose response was lost may already have appeared in a refetch.
  // Confirming its retry must not count that same server ID a second time.
  const alreadyCounted = entries.some(([, cache]) =>
    cache?.pages.some((page) =>
      page.posts.some(
        (entry) => entry.id === saved.id && entry.status !== "ARCHIVED"
      )
    )
  );
  for (const [key, cache] of entries) {
    const profile = cache?.pages[0]?.profile;
    if (!(cache && profile)) {
      continue;
    }
    const isNew = !previous;
    const wasArchived = previous?.status === "ARCHIVED";
    const countDelta = (isNew || wasArchived) && !alreadyCounted ? 1 : 0;
    const post: PostDTO = {
      body: saved.content.body,
      bookmarkCount: previous?.bookmarkCount ?? 0,
      commentCount: previous?.commentCount ?? 0,
      createdAt: previous?.createdAt ?? new Date().toISOString(),
      creator: profile,
      excerpt: saved.content.excerpt,
      id: saved.id,
      isBookmarked: previous?.isBookmarked ?? false,
      isLiked: previous?.isLiked ?? false,
      likeCount: previous?.likeCount ?? 0,
      locked: false,
      mediaType: saved.mediaType ?? previous?.mediaType ?? null,
      mediaUrl: saved.mediaType
        ? `/api/media/${saved.id}`
        : (previous?.mediaUrl ?? null),
      previewUrl: saved.content.previewUrl,
      status: saved.content.status,
      title: saved.content.title,
      visibility: saved.content.visibility,
    };
    const hasPost = cache.pages.some((page) =>
      page.posts.some((entry) => entry.id === saved.id)
    );
    const visible = acceptsStudioPost(key, post.status);
    queryClient.setQueryData<StudioCache>(key, {
      ...cache,
      pages: cache.pages.map((page, index) => {
        let posts = page.posts.filter((entry) => entry.id !== saved.id);
        if (visible && index === 0 && !hasPost) {
          posts = [post, ...posts];
        }
        if (visible && hasPost) {
          posts = page.posts.map((entry) =>
            entry.id === saved.id
              ? {
                  ...post,
                  bookmarkCount: entry.bookmarkCount,
                  commentCount: entry.commentCount,
                  isBookmarked: entry.isBookmarked,
                  isLiked: entry.isLiked,
                  likeCount: entry.likeCount,
                }
              : entry
          );
        }
        return {
          ...page,
          metrics: { ...page.metrics, posts: page.metrics.posts + countDelta },
          posts,
        };
      }),
    });
  }
}
