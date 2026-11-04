import { ORPCError } from "@orpc/server";
import type { Bucket } from "@upstash/blob";
import type { MediaType } from "./media-policy";
import { readStreamPrefix } from "./read-stream-prefix";
import { validateMediaSignature } from "./validate-media-signature";

export async function verifyStoredMedia(
  bucket: Bucket,
  path: string,
  mime: MediaType,
  etag: string
): Promise<void> {
  const { url } = await bucket.signedReadUrl(path, { expiresIn: "2m" });
  const response = await fetch(url, {
    cache: "no-store",
    headers: { "If-Match": etag, Range: "bytes=0-31" },
    redirect: "error",
    signal: AbortSignal.timeout(10_000),
  });
  if (![200, 206].includes(response.status)) {
    await response.body?.cancel();
    throw new ORPCError("BAD_GATEWAY");
  }
  // The SDK's browser-supplied sample is only a convenience. Inspect stored bytes
  // before granting this object a MediaAsset record usable by a publication.
  const bytes = await readStreamPrefix(response.body, 32);
  validateMediaSignature(bytes, mime);
}
