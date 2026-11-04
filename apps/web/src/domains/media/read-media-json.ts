import { ORPCError } from "@orpc/server";
import { MAX_MEDIA_JSON_BYTES } from "./media-policy";

export async function readMediaJson(request: Request): Promise<unknown> {
  if (
    request.headers.get("content-type")?.split(";")[0]?.trim() !==
    "application/json"
  ) {
    throw new ORPCError("UNSUPPORTED_MEDIA_TYPE", {
      message: "Envie os dados em formato JSON.",
    });
  }
  const length = Number(request.headers.get("content-length") ?? 0);
  if (
    !Number.isSafeInteger(length) ||
    length < 0 ||
    length > MAX_MEDIA_JSON_BYTES
  ) {
    throw new ORPCError("PAYLOAD_TOO_LARGE", {
      message: "A solicitação excede o tamanho permitido.",
    });
  }
  const reader = request.body?.getReader();
  if (!reader) {
    throw new ORPCError("BAD_REQUEST", {
      message: "Os dados do envio são obrigatórios.",
    });
  }
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    let chunk = await reader.read();
    while (!chunk.done) {
      size += chunk.value.byteLength;
      if (size > MAX_MEDIA_JSON_BYTES) {
        // biome-ignore lint/performance/noAwaitInLoops: Cancel the sequential stream before rejecting an oversized body.
        await reader.cancel();
        throw new ORPCError("PAYLOAD_TOO_LARGE", {
          message: "A solicitação excede o tamanho permitido.",
        });
      }
      chunks.push(chunk.value);
      chunk = await reader.read();
    }
  } finally {
    reader.releaseLock();
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder().decode(body)) as unknown;
  } catch (error) {
    throw new ORPCError("BAD_REQUEST", {
      cause: error,
      message: "Os dados do envio são inválidos.",
    });
  }
}
