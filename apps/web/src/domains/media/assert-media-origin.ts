import { ORPCError } from "@orpc/server";

export function assertMediaOrigin(headers: Headers, authUrl: string): void {
  if (
    headers.get("origin") !== new URL(authUrl).origin ||
    headers.get("sec-fetch-site") === "cross-site"
  ) {
    throw new ORPCError("FORBIDDEN", {
      message: "A origem desta solicitação não é permitida.",
    });
  }
}
