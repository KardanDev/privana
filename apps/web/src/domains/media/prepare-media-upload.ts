import { ORPCError } from "@orpc/server";
import { MAX_MEDIA_BYTES, MEDIA_EXTENSIONS } from "./media-policy";

export function prepareMediaUpload(
  file: { type: string; size: number },
  userId: string
) {
  const entry = Object.entries(MEDIA_EXTENSIONS).find(
    ([mime]) => mime === file.type
  );
  if (!entry) {
    throw new ORPCError("UNSUPPORTED_MEDIA_TYPE");
  }
  if (
    !Number.isSafeInteger(file.size) ||
    file.size <= 0 ||
    file.size > MAX_MEDIA_BYTES
  ) {
    throw new ORPCError("PAYLOAD_TOO_LARGE");
  }
  return {
    cache: "no-store" as const,
    metadata: { owner: userId },
    path: `${userId}/${crypto.randomUUID()}.${entry[1]}`,
  };
}
