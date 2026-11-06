"use client";
import { useMutationState } from "@tanstack/react-query";
import { MESSAGE_SEND_KEY } from "./message-query-keys";
import type { OutboxMessage } from "./message-types";
import { readMessageAttempt } from "./read-message-attempt";

export function useMessageOutbox(conversationId?: string): OutboxMessage[] {
  const attempts = useMutationState({
    filters: {
      mutationKey: MESSAGE_SEND_KEY,
      predicate: (mutation) =>
        mutation.state.status === "pending" ||
        mutation.state.status === "error",
    },
    select: (mutation) => ({
      attempt: readMessageAttempt(mutation.state.variables),
      status: mutation.state.status,
    }),
  });
  return attempts.flatMap(({ attempt, status }) =>
    attempt &&
    (!conversationId || attempt.conversationId === conversationId) &&
    (status === "pending" || status === "error")
      ? [{ attempt, status }]
      : []
  );
}
