import type { MessageAttempt } from "./message-types";

export function readMessageAttempt(value: unknown): MessageAttempt | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  if (
    !(
      "id" in value &&
      typeof value.id === "string" &&
      "body" in value &&
      typeof value.body === "string" &&
      "createdAt" in value &&
      typeof value.createdAt === "string" &&
      "senderId" in value &&
      typeof value.senderId === "string" &&
      "conversationId" in value &&
      typeof value.conversationId === "string"
    )
  ) {
    return null;
  }
  return {
    body: value.body,
    conversationId: value.conversationId,
    createdAt: value.createdAt,
    id: value.id,
    senderId: value.senderId,
  };
}
