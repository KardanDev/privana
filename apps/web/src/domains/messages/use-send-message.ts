"use client";
import type { ConversationDTO } from "@privana/api/contracts/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { handleActionError } from "@/domains/feed/handle-action-error";
import { client } from "@/utils/orpc";
import { appendMessage } from "./append-message";
import { confirmMessage } from "./confirm-message";
import {
  CONVERSATIONS_KEY,
  MESSAGE_SEND_KEY,
  messageHistoryKey,
} from "./message-query-keys";
import type { MessageAttempt, MessageHistory } from "./message-types";
import { readMessageAttempt } from "./read-message-attempt";
import { updateConversationPreview } from "./update-conversation-preview";

export function useSendMessage(
  conversationId: string,
  restoreDraft: (body: string) => void
) {
  const queryClient = useQueryClient();
  const key = messageHistoryKey(conversationId);
  const mutation = useMutation({
    mutationFn: (attempt: MessageAttempt) =>
      client.messages.send({
        body: attempt.body,
        clientMessageId: attempt.id.slice("pending-".length),
        conversationId: attempt.conversationId,
      }),
    mutationKey: [...MESSAGE_SEND_KEY, conversationId],
    onError: (error, attempt) => {
      queryClient.setQueryData<MessageHistory>(key, (history) =>
        history
          ? {
              ...history,
              pages: history.pages.map((page) =>
                page.filter((message) => message.id !== attempt.id)
              ),
            }
          : history
      );
      restoreDraft(attempt.body);
      handleActionError(error);
    },
    onMutate: async (attempt) => {
      await queryClient.cancelQueries({ queryKey: key });
      queryClient.setQueryData<MessageHistory>(key, (history) =>
        appendMessage(history, { ...attempt, delivery: "pending" })
      );
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: key, refetchType: "none" }),
        queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY }),
      ]);
    },
    onSuccess: (message, attempt) => {
      queryClient.setQueryData<MessageHistory>(key, (history) =>
        confirmMessage(history, attempt.id, message)
      );
      queryClient.setQueryData<ConversationDTO[]>(
        CONVERSATIONS_KEY,
        (conversations) =>
          updateConversationPreview(conversations, conversationId, message)
      );
    },
    // Recovery is explicit; every retry reuses the same server idempotency key.
    retry: false,
  });
  const submit = useCallback(
    (attempt: MessageAttempt) => {
      if (
        queryClient.isMutating({
          mutationKey: [...MESSAGE_SEND_KEY, conversationId],
        }) > 0
      ) {
        return false;
      }
      // A manual retry replaces the failed attempt instead of leaving two bubbles.
      const cache = queryClient.getMutationCache();
      for (const entry of cache.findAll({
        mutationKey: [...MESSAGE_SEND_KEY, conversationId],
        status: "error",
      })) {
        if (readMessageAttempt(entry.state.variables)?.id === attempt.id) {
          cache.remove(entry);
        }
      }
      mutation.mutate(attempt);
      return true;
    },
    [conversationId, mutation, queryClient]
  );
  return { submit };
}
