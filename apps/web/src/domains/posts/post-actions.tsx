"use client";

import type { PostDTO } from "@privana/api/contracts/product";
import { Button } from "@privana/ui/components/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { useCallback } from "react";
import { handleActionError } from "@/domains/feed/handle-action-error";
import { orpc } from "@/utils/orpc";

export function PostActions({
  post,
  commentsOpen,
  onComments,
}: {
  post: PostDTO;
  commentsOpen: boolean;
  onComments: () => void;
}) {
  const queryClient = useQueryClient();
  const like = useMutation(
    orpc.posts.setLike.mutationOptions({
      onError: handleActionError,
      onSuccess: async () => {
        await queryClient.invalidateQueries();
      },
    })
  );
  const bookmark = useMutation(
    orpc.posts.setBookmark.mutationOptions({
      onError: handleActionError,
      onSuccess: async () => {
        await queryClient.invalidateQueries();
      },
    })
  );
  const toggleLike = useCallback(
    () => like.mutate({ liked: !post.isLiked, postId: post.id }),
    [like, post]
  );
  const toggleBookmark = useCallback(
    () => bookmark.mutate({ bookmarked: !post.isBookmarked, postId: post.id }),
    [bookmark, post]
  );
  return (
    <div className="flex items-center gap-2 px-3 py-2 sm:px-4">
      <Button
        aria-label={post.isLiked ? "Descurtir publicação" : "Curtir publicação"}
        aria-pressed={post.isLiked}
        disabled={like.isPending}
        onClick={toggleLike}
        size="sm"
        variant="ghost"
      >
        <Heart
          className={post.isLiked ? "fill-primary text-primary" : ""}
          data-icon="inline-start"
        />
        <span className="tabular-nums">{post.likeCount}</span>
      </Button>
      <Button
        aria-expanded={commentsOpen}
        aria-label="Ver comentários"
        disabled={post.locked}
        onClick={onComments}
        size="sm"
        variant="ghost"
      >
        <MessageCircle data-icon="inline-start" />
        <span className="tabular-nums">{post.commentCount}</span>
      </Button>
      <Button
        aria-label={
          post.isBookmarked ? "Remover dos salvos" : "Salvar publicação"
        }
        aria-pressed={post.isBookmarked}
        className="ml-auto"
        disabled={bookmark.isPending}
        onClick={toggleBookmark}
        size="icon"
        variant="ghost"
      >
        <Bookmark
          className={post.isBookmarked ? "fill-primary text-primary" : ""}
        />
      </Button>
    </div>
  );
}
