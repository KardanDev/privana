import type { MessageDTO } from "@privana/api/contracts/product";
import { appendMessage } from "./append-message";
import type { MessageHistory } from "./message-types";

export function confirmMessage(
  history: MessageHistory | undefined,
  clientId: string,
  message: MessageDTO
): MessageHistory | undefined {
  if (!history) {
    return history;
  }
  return appendMessage(
    {
      ...history,
      pages: history.pages.map((page) =>
        page.filter((entry) => entry.id !== clientId)
      ),
    },
    { ...message, clientId }
  );
}
