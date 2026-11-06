import { mergeMessagePages } from "./merge-message-pages";
import type { ConversationMessage, OutboxMessage } from "./message-types";

export function visibleMessageHistory(
  pages: ConversationMessage[][],
  outbox: OutboxMessage[]
): ConversationMessage[] {
  const confirmed = new Set(
    pages.flatMap((page) =>
      page.flatMap((message) => (message.clientId ? [message.clientId] : []))
    )
  );
  const serverIds = new Set(
    pages.flatMap((page) => page.map((message) => message.id))
  );
  const unsent: ConversationMessage[] = outbox
    .filter(
      ({ attempt }) =>
        !(
          confirmed.has(attempt.id) ||
          serverIds.has(attempt.id.slice("pending-".length))
        )
    )
    .map(({ attempt, status }) => ({
      ...attempt,
      delivery: status === "pending" ? "pending" : "failed",
    }));
  return mergeMessagePages([...pages, unsent]);
}
