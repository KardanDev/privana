import { ORPCError } from "@orpc/server";
export function requireOwner(userId: string, ownerId: string): void {
  if (userId !== ownerId) {
    throw new ORPCError("FORBIDDEN", {
      message: "Esta ação pertence a outra conta.",
    });
  }
}
