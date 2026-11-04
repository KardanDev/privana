import { ORPCError } from "@orpc/server";
import type { MediaType } from "./media-policy";

const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];

export function validateMediaSignature(
  bytes: Uint8Array,
  type: MediaType
): void {
  const header = new TextDecoder("ascii").decode(bytes.subarray(0, 12));
  const allowed =
    (type === "image/png" &&
      PNG_SIGNATURE.every((value, index) => bytes[index] === value)) ||
    (type === "image/jpeg" &&
      bytes[0] === 255 &&
      bytes[1] === 216 &&
      bytes[2] === 255) ||
    (type === "image/webp" &&
      header.startsWith("RIFF") &&
      header.slice(8, 12) === "WEBP") ||
    (type === "video/mp4" &&
      bytes.length >= 12 &&
      header.slice(4, 8) === "ftyp");
  if (!allowed) {
    throw new ORPCError("UNSUPPORTED_MEDIA_TYPE");
  }
}
