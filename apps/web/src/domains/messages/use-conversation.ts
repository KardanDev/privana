"use client";
import type { MessageDTO } from "@privana/api/contracts/product";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { type ChangeEvent, type FormEvent, useCallback, useState } from "react";
import { client, orpc } from "@/utils/orpc";
import { messageHistoryKey } from "./message-query-keys";
import { useMessageOutbox } from "./use-message-outbox";
import { useSendMessage } from "./use-send-message";
import { visibleMessageHistory } from "./visible-message-history";

const MESSAGES_PER_PAGE = 50;

export function useConversation(conversationId: string) {
  const [body, setBody] = useState("");
  const outbox = useMessageOutbox(conversationId);
  const pending = outbox.some((message) => message.status === "pending");
  const viewer = useQuery(orpc.viewer.get.queryOptions());
  const messages = useInfiniteQuery({
    getNextPageParam: (lastPage: MessageDTO[]) =>
      lastPage.length === MESSAGES_PER_PAGE ? lastPage[0]?.id : undefined,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      client.messages.get({ before: pageParam, conversationId }),
    queryKey: messageHistoryKey(conversationId),
    refetchInterval: pending ? false : 15_000,
  });
  const restoreDraft = useCallback(
    (failedBody: string) =>
      setBody((draft) => (draft.trim() ? draft : failedBody)),
    []
  );
  const { submit } = useSendMessage(conversationId, restoreDraft);
  const submitMessage = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!(body.trim() && viewer.data) || pending || !messages.data) {
        return;
      }
      const previousFailure = outbox.find(
        (message) =>
          message.status === "error" && message.attempt.body === body.trim()
      );
      const attempt = previousFailure?.attempt ?? {
        body: body.trim(),
        conversationId,
        createdAt: new Date().toISOString(),
        id: `pending-${crypto.randomUUID()}`,
        senderId: viewer.data.id,
      };
      if (submit(attempt)) {
        setBody("");
      }
    },
    [body, conversationId, messages.data, outbox, pending, submit, viewer.data]
  );
  const changeMessage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setBody(event.target.value),
    []
  );
  const retryMessage = useCallback(
    (id: string) => {
      const attempt = outbox.find(
        (message) => message.status === "error" && message.attempt.id === id
      )?.attempt;
      if (attempt && submit(attempt)) {
        setBody((draft) => (draft.trim() === attempt.body ? "" : draft));
      }
    },
    [outbox, submit]
  );
  const retryMessages = useCallback(() => messages.refetch(), [messages]);
  const loadOlderMessages = useCallback(
    () => messages.fetchNextPage(),
    [messages]
  );
  return {
    body,
    changeMessage,
    history: visibleMessageHistory(messages.data?.pages ?? [], outbox),
    loadOlderMessages,
    messages,
    pending,
    retryMessage,
    retryMessages,
    submitMessage,
    viewerId: viewer.data?.id,
  };
}
