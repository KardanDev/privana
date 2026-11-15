import type { SetStateAction } from "react";
import type { MessageDrafts } from "./message-types";

export function updateMessageDraft(
  previous: MessageDrafts,
  conversationId: string,
  update: SetStateAction<string>
): MessageDrafts {
  const current = Object.hasOwn(previous, conversationId)
    ? (previous[conversationId] ?? "")
    : "";
  const body = typeof update === "function" ? update(current) : update;
  return body === current ? previous : { ...previous, [conversationId]: body };
}
