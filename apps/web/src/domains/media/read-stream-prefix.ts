import { ORPCError } from "@orpc/server";

export async function readStreamPrefix(
  stream: ReadableStream<Uint8Array> | null,
  limit: number
): Promise<Uint8Array> {
  if (!stream) {
    throw new ORPCError("BAD_GATEWAY");
  }
  const reader = stream.getReader();
  const result = new Uint8Array(limit);
  let size = 0;
  try {
    while (size < limit) {
      // biome-ignore lint/performance/noAwaitInLoops: Stream chunks must be read sequentially.
      const chunk = await reader.read();
      if (chunk.done) {
        break;
      }
      const prefix = chunk.value.subarray(0, limit - size);
      result.set(prefix, size);
      size += prefix.byteLength;
    }
  } finally {
    await reader.cancel();
    reader.releaseLock();
  }
  return result.subarray(0, size);
}
