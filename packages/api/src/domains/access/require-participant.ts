import { ORPCError } from "@orpc/server";
export function requireParticipant(
  userId: string,
  conversation: { participantAId: string; participantBId: string }
): void {
  if (
    userId !== conversation.participantAId &&
    userId !== conversation.participantBId
  ) {
    throw new ORPCError("FORBIDDEN");
  }
}
