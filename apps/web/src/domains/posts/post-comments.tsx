"use client";

import type { CommentDTO, PageDTO } from "@privana/api/contracts/product";
import { Button } from "@privana/ui/components/button";
import { Input } from "@privana/ui/components/input";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useCallback, useState } from "react";
import { QueryFeedback } from "@/domains/feed/components/query-feedback";
import { handleActionError } from "@/domains/feed/handle-action-error";
import { Avatar } from "@/shared/components/avatar";
import { formatDate } from "@/shared/formatting/format-date";
import { client, orpc } from "@/utils/orpc";
export function PostComments({ postId }: { postId: string }) {
  const [body, setBody] = useState("");
  const queryClient = useQueryClient();
  const comments = useInfiniteQuery({
    getNextPageParam: (page: PageDTO<CommentDTO>) =>
      page.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      client.posts.comments({ cursor: pageParam, postId }),
    queryKey: ["post-comments", postId],
  });
  const items = comments.data?.pages.flatMap((page) => page.items) ?? [];
  const add = useMutation(
    orpc.posts.addComment.mutationOptions({
      onError: handleActionError,
      onSuccess: async () => {
        setBody("");
        await queryClient.invalidateQueries();
      },
    })
  );
  const retryComments = useCallback(() => comments.refetch(), [comments]);
  const loadMore = useCallback(() => comments.fetchNextPage(), [comments]);
  const submitComment = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (body.trim()) {
        add.mutate({ body: body.trim(), postId });
      }
    },
    [body, add, postId]
  );
  const changeComment = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setBody(event.target.value),
    []
  );
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
        <QueryFeedback error={comments.error} retry={retryComments} />
      ) : null}
      {comments.isSuccess && items.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Seja a primeira pessoa a deixar um comentário.
        </p>
      ) : null}
      {items.map((comment) => (
        <div className="flex gap-3" key={comment.id}>
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
                {formatDate(comment.createdAt)}
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
          onClick={loadMore}
          variant="ghost"
        >
          Ver mais comentários
        </Button>
      ) : null}
      <form className="flex gap-2" onSubmit={submitComment}>
        <label className="sr-only" htmlFor={`comment-${postId}`}>
          Seu comentário
        </label>
        <Input
          id={`comment-${postId}`}
          maxLength={2000}
          onChange={changeComment}
          placeholder="Faça parte da conversa…"
          required
          value={body}
        />
        <Button
          aria-label="Enviar comentário"
          disabled={add.isPending || !body.trim()}
          size="icon"
          type="submit"
        >
          <Send />
        </Button>
      </form>
    </section>
  );
}
