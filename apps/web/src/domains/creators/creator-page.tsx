"use client";

import type { PageDTO, PostDTO } from "@privana/api/contracts/product";
import { Button } from "@privana/ui/components/button";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { CreatorProfileHeader } from "@/domains/creators/creator-profile-header";
import { QueryFeedback } from "@/domains/feed/components/query-feedback";
import { CreatorSuggestions } from "@/domains/feed/creator-suggestions";
import { PostStreamSkeleton } from "@/domains/feed/post-stream-skeleton";
import { MembershipPanel } from "@/domains/memberships/membership-panel";
import { PostCard } from "@/domains/posts/post-card";
import { client } from "@/utils/orpc";

export function CreatorPage({ handle }: { handle: string }) {
  const creator = useQuery({
    queryFn: () => client.creators.get({ handle }),
    queryKey: ["creator", handle],
  });
  const creatorId = creator.data?.id;
  const posts = useInfiniteQuery({
    enabled: Boolean(creatorId),
    getNextPageParam: (page: PageDTO<PostDTO>) => page.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      client.feed.list({ creatorId, cursor: pageParam }),
    queryKey: ["creator-posts", creatorId],
  });
  const retryCreator = useCallback(() => creator.refetch(), [creator]);
  const retryPosts = useCallback(() => posts.refetch(), [posts]);
  const loadMore = useCallback(() => posts.fetchNextPage(), [posts]);
  if (creator.isPending) {
    return <PostStreamSkeleton />;
  }
  if (creator.isError) {
    return <QueryFeedback error={creator.error} retry={retryCreator} />;
  }
  const profile = creator.data;
  return (
    <div className="grid grid-cols-[minmax(0,640px)] items-start justify-center gap-6 xl:grid-cols-[minmax(0,640px)_280px]">
      <section className="min-w-0 border-x bg-card">
        <CreatorProfileHeader creator={profile} />
        <div className="xl:hidden">
          <MembershipPanel creator={profile} />
        </div>
        <div className="flex border-y px-5">
          <h2 className="border-primary border-b-2 px-1 py-3 font-semibold text-sm">
            Publicações
          </h2>
        </div>
        {posts.isPending ? <PostStreamSkeleton /> : null}
        {posts.isError ? (
          <QueryFeedback error={posts.error} retry={retryPosts} />
        ) : null}
        {posts.data?.pages[0]?.items.length === 0 ? (
          <div className="px-5 py-12 text-center text-muted-foreground text-sm">
            <p className="font-semibold text-foreground">
              Nenhuma publicação ainda
            </p>
            <p className="mt-2">
              As publicações de {profile.displayName} aparecerão aqui.
            </p>
          </div>
        ) : null}
        {posts.data?.pages
          .flatMap((page) => page.items)
          .map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        {posts.hasNextPage ? (
          <div className="p-4 text-center">
            <Button
              disabled={posts.isFetchingNextPage}
              onClick={loadMore}
              variant="outline"
            >
              Carregar mais
            </Button>
          </div>
        ) : null}
      </section>
      <aside className="hidden flex-col gap-6 py-5 xl:flex">
        <MembershipPanel creator={profile} />
        <CreatorSuggestions />
      </aside>
    </div>
  );
}
