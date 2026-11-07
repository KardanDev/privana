import { createHash } from "node:crypto";

export function createCommentId(marker) {
  const bytes = createHash("sha256").update(marker).digest().subarray(0, 16);
  // biome-ignore lint/suspicious/noBitwiseOperators: Preserve the UUID version bits while retaining deterministic hash bytes.
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  // biome-ignore lint/suspicious/noBitwiseOperators: Set the RFC UUID variant bits without changing the remaining hash bits.
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
