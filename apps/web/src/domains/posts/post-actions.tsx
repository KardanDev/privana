"use client";

import type { PostDTO } from "@privana/api/contracts/product";
import { Button } from "@privana/ui/components/button";
import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { useSocialToggle } from "@/shared/query/use-social-toggle";

export function PostActions({
  post,
  commentsOpen,
  onComments,
}: {
  post: PostDTO;
  commentsOpen: boolean;
  onComments: () => void;
}) {
  const like = useSocialToggle({
    kind: "like",
    liked: !post.isLiked,
    postId: post.id,
  });
  const bookmark = useSocialToggle({
    bookmarked: !post.isBookmarked,
    kind: "bookmark",
    postId: post.id,
  });
  return (
    <div className="flex items-center gap-2 px-3 py-2 sm:px-4">
      <Button
        aria-busy={like.pending}
        aria-label={post.isLiked ? "Descurtir publicação" : "Curtir publicação"}
        aria-pressed={post.isLiked}
        disabled={like.pending}
        onClick={like.run}
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
        aria-busy={bookmark.pending}
        aria-label={
          post.isBookmarked ? "Remover dos salvos" : "Salvar publicação"
        }
        aria-pressed={post.isBookmarked}
        className="ml-auto"
        disabled={bookmark.pending}
        onClick={bookmark.run}
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
