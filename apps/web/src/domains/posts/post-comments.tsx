"use client";

import { Button } from "@privana/ui/components/button";
import { Input } from "@privana/ui/components/input";
import { Send } from "lucide-react";
import { QueryFeedback } from "@/domains/feed/components/query-feedback";
import { Avatar } from "@/shared/components/avatar";
import { formatDate } from "@/shared/formatting/format-date";
import { usePostComments } from "./use-post-comments";
export function PostComments({
  postId,
  locked = false,
}: {
  postId: string;
  locked?: boolean;
}) {
  const state = usePostComments(postId, locked);
  const { body, comments, items } = state;
  return (
    <section
      aria-label="Comentários"
      className="flex flex-col gap-5 border-t pt-5"
    >
      {comments.isLoading ? (
        <p className="text-muted-foreground text-sm" role="status">
          Carregando a conversa…
        </p>
      ) : null}
      {comments.isError ? (
        <QueryFeedback error={comments.error} retry={state.retry} />
      ) : null}
      {comments.isSuccess && items.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Seja a primeira pessoa a deixar um comentário.
        </p>
      ) : null}
      {items.map((comment) => (
        <div
          aria-busy={comment.id.startsWith("pending-comment-")}
          className="flex gap-3"
          key={comment.id}
        >
          <Avatar
            name={comment.author.name}
            size={32}
            src={comment.author.image}
          />
          <div className="min-w-0">
            <p className="font-medium text-sm">
              {comment.author.name}
              <time
                className="ml-2 text-muted-foreground text-xs"
                dateTime={comment.createdAt}
              >
                {comment.id.startsWith("pending-comment-")
                  ? "Enviando…"
                  : formatDate(comment.createdAt)}
              </time>
            </p>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed">
              {comment.body}
            </p>
          </div>
        </div>
      ))}
      {comments.hasNextPage ? (
        <Button
          disabled={comments.isFetchingNextPage}
          onClick={state.loadMore}
          variant="ghost"
        >
          Ver mais comentários
        </Button>
      ) : null}
      <form className="flex gap-2" onSubmit={state.submit}>
        <label className="sr-only" htmlFor={`comment-${postId}`}>
          Seu comentário
        </label>
        <Input
          disabled={state.pending || locked}
          id={`comment-${postId}`}
          maxLength={2000}
          onChange={state.change}
          placeholder="Faça parte da conversa…"
          required
          value={body}
        />
        <Button
          aria-busy={state.pending}
          aria-label="Enviar comentário"
          disabled={state.pending || locked || !body.trim()}
          size="icon"
          type="submit"
        >
          <Send />
        </Button>
      </form>
    </section>
  );
}
