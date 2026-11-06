export const CONVERSATIONS_KEY = ["conversations"] as const;
export const MESSAGE_SEND_KEY = ["messages", "send"] as const;

export function messageHistoryKey(conversationId: string) {
  return ["conversation", conversationId] as const;
}
