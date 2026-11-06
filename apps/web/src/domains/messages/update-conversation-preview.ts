import type {
  ConversationDTO,
  MessageDTO,
} from "@privana/api/contracts/product";

export function updateConversationPreview(
  conversations: ConversationDTO[] | undefined,
  conversationId: string,
  message: MessageDTO
): ConversationDTO[] | undefined {
  return conversations
    ?.map((conversation) =>
      conversation.id === conversationId &&
      Date.parse(message.createdAt) >= Date.parse(conversation.updatedAt)
        ? {
            ...conversation,
            lastMessage: message.body,
            updatedAt: message.createdAt,
          }
        : conversation
    )
    .toSorted(
      (left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt)
    );
}
