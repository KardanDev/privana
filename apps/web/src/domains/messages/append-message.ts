import type { ConversationMessage, MessageHistory } from "./message-types";

export function appendMessage(
  history: MessageHistory | undefined,
  message: ConversationMessage
): MessageHistory | undefined {
  if (!history) {
    return history;
  }
  const pages = history.pages.map((page) =>
    page.filter((entry) => entry.id !== message.id)
  );
  const [first] = pages;
  if (!first) {
    return history;
  }
  return { ...history, pages: [[...first, message], ...pages.slice(1)] };
}
