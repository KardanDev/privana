"use client";

import type { PageDTO, PostDTO } from "@privana/api/contracts/product";
import { Button } from "@privana/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@privana/ui/components/empty";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Bookmark, Compass } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { QueryFeedback } from "@/domains/feed/components/query-feedback";
import { PostStreamSkeleton } from "@/domains/feed/post-stream-skeleton";
import { PostCard } from "@/domains/posts/post-card";
import { client } from "@/utils/orpc";

export function PostStream({
  mode,
}: {
  mode: "latest" | "following" | "saved";
}) {
  const feed = useInfiniteQuery({
    getNextPageParam: (page: PageDTO<PostDTO>) => page.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      client.feed.list({
        cursor: pageParam,
        following: mode === "following",
        saved: mode === "saved",
      }),
    queryKey: ["social-stream", mode],
  });
  const posts = feed.data?.pages.flatMap((page) => page.items) ?? [];
  const retry = useCallback(() => feed.refetch(), [feed]);
  const loadMore = useCallback(() => feed.fetchNextPage(), [feed]);
  if (feed.isPending) {
    return <PostStreamSkeleton />;
  }
  if (feed.isError && !feed.data) {
    return <QueryFeedback error={feed.error} retry={retry} />;
  }
  return (
    <div>
      {posts.length === 0 ? (
        <Empty className="min-h-72 rounded-none p-6">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              {mode === "saved" ? <Bookmark /> : <Compass />}
            </EmptyMedia>
            <EmptyTitle>
              {mode === "saved"
                ? "Nenhuma publicação salva"
                : "Nenhuma publicação por aqui"}
            </EmptyTitle>
            <EmptyDescription>
              {mode === "following"
                ? "Siga criadores para acompanhar as publicações deles."
                : "Explore perfis e encontre os criadores que você quer acompanhar."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              nativeButton={false}
              render={<Link href="/explore" />}
              variant="outline"
            >
              Explorar criadores
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
      {feed.hasNextPage ? (
        <div className="p-4 text-center">
          <Button
            disabled={feed.isFetchingNextPage}
            onClick={loadMore}
            variant="outline"
          >
            {feed.isFetchingNextPage ? "Carregando…" : "Carregar mais"}
          </Button>
        </div>
      ) : null}
      {feed.isFetchNextPageError ? (
        <p
          className="p-4 text-center text-muted-foreground text-sm"
          role="status"
        >
          Não foi possível carregar as próximas publicações. Tente novamente.
        </p>
      ) : null}
    </div>
  );
}
