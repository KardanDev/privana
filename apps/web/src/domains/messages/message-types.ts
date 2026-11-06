import type { MessageDTO } from "@privana/api/contracts/product";
import type { InfiniteData } from "@tanstack/react-query";

export interface MessageAttempt extends MessageDTO {
  conversationId: string;
}

export interface ConversationMessage extends MessageDTO {
  clientId?: string;
  delivery?: "pending" | "failed";
}

export type MessageHistory = InfiniteData<
  ConversationMessage[],
  string | undefined
>;

export interface OutboxMessage {
  attempt: MessageAttempt;
  status: "pending" | "error";
}
