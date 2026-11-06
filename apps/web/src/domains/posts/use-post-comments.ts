"use client";

import type { CommentDTO, PageDTO } from "@privana/api/contracts/product";
import {
  type InfiniteData,
  useInfiniteQuery,
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import { handleActionError } from "@/domains/feed/handle-action-error";
import { beginSocialPatch } from "@/shared/query/begin-social-patch";
import { reconcileSocialQueries } from "@/shared/query/reconcile-social-queries";
import {
  SOCIAL_MUTATION_KEY,
  type SocialSnapshot,
} from "@/shared/query/social-patch";
import { undoSocialPatch } from "@/shared/query/undo-social-patch";
import { client, orpc } from "@/utils/orpc";
import { appendConfirmedComment } from "./append-confirmed-comment";
import { type CommentAttempt, commentAttempt } from "./comment-attempt";

interface CommentMutationContext {
  delta: number;
  snapshot: SocialSnapshot;
}

export function usePostComments(postId: string, locked: boolean) {
  const [body, setBody] = useState("");
  const [optimistic, setOptimistic] = useState<CommentDTO | null>(null);
  const lock = useRef(false);
  const attempt = useRef<CommentAttempt | null>(null);
  const queryClient = useQueryClient();
  const viewer = useQuery(orpc.viewer.get.queryOptions());
  const mutationKey = [...SOCIAL_MUTATION_KEY, "comment", postId];
  const pending = useIsMutating({ mutationKey }) > 0;
  const comments = useInfiniteQuery({
    enabled: !locked,
    getNextPageParam: (page: PageDTO<CommentDTO>) =>
      page.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      client.posts.comments({ cursor: pageParam, postId }),
    queryKey: ["post-comments", postId],
  });
  const add = useMutation<
    CommentDTO,
    Error,
    CommentAttempt,
    CommentMutationContext
  >({
    mutationFn: (variables) => client.posts.addComment(variables),
    mutationKey,
    onError: (error, _variables, context) => {
      setOptimistic(null);
      undoSocialPatch(queryClient, context?.snapshot, {
        delta: context?.delta ?? 0,
        kind: "comment",
        postId,
      });
      handleActionError(error);
    },
    onMutate: async (variables) => {
      if (locked) {
        throw new Error("Esta publicação exige acesso ativo.");
      }
      await queryClient.cancelQueries({ queryKey: ["post-comments", postId] });
      const known = queryClient
        .getQueryData<InfiniteData<PageDTO<CommentDTO>>>([
          "post-comments",
          postId,
        ])
        ?.pages.flatMap((page) => page.items)
        .find((comment) => comment.id === variables.clientCommentId);
      const delta = known ? 0 : 1;
      const snapshot = await beginSocialPatch(queryClient, {
        delta,
        kind: "comment",
        postId,
      });
      if (viewer.data) {
        setOptimistic(
          known ?? {
            author: {
              id: viewer.data.id,
              image: viewer.data.image,
              name: viewer.data.name,
            },
            body: variables.body,
            createdAt: new Date().toISOString(),
            id: `pending-comment-${variables.clientCommentId}`,
          }
        );
      }
      return { delta, snapshot };
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["post-comments", postId] }),
        reconcileSocialQueries(queryClient),
      ]);
      lock.current = false;
    },
    onSuccess: (comment) => {
      queryClient.setQueryData<InfiniteData<PageDTO<CommentDTO>>>(
        ["post-comments", postId],
        (data) => appendConfirmedComment(data, comment)
      );
      setOptimistic(comment);
      setBody("");
      attempt.current = null;
    },
    retry: false,
  });
  const items = comments.data?.pages.flatMap((page) => page.items) ?? [];
  const visibleItems =
    optimistic &&
    !items.some(
      (item) =>
        item.id === optimistic.id ||
        `pending-comment-${item.id}` === optimistic.id
    )
      ? [...items, optimistic]
      : items;
  const retry = useCallback(() => comments.refetch(), [comments]);
  const loadMore = useCallback(() => comments.fetchNextPage(), [comments]);
  const submit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (
        locked ||
        lock.current ||
        !body.trim() ||
        queryClient.isMutating({
          mutationKey: [...SOCIAL_MUTATION_KEY, "comment", postId],
        })
      ) {
        return;
      }
      lock.current = true;
      attempt.current = commentAttempt(attempt.current, postId, body);
      add.mutate(attempt.current);
    },
    [add, body, locked, postId, queryClient]
  );
  const change = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setBody(event.target.value),
    []
  );
  return {
    body,
    change,
    comments,
    items: visibleItems,
    loadMore,
    pending,
    retry,
    submit,
  };
}
