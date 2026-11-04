import { ORPCError } from "@orpc/server";
import type { Database } from "@privana/db";
import { partialMediaLength } from "../../src/domains/media/partial-media-length";
import { readMediaMetadata } from "../../src/domains/media/read-media-metadata";
import { readPrivateMedia } from "../../src/domains/media/read-private-media";
import { readStreamPrefix } from "../../src/domains/media/read-stream-prefix";

export async function checkStoredMedia(
  db: Database,
  postId: string,
  token: string
) {
  const post = await db.post.findUnique({
    select: { mediaKey: true, mediaType: true },
    where: { id: postId },
  });
  if (!(post?.mediaKey && post.mediaType)) {
    throw new Error("A publicação de teste não possui mídia armazenada.");
  }
  const metadata = await readMediaMetadata(post.mediaKey, token);
  if (metadata.contentType !== post.mediaType) {
    throw new Error("O tipo armazenado não corresponde à publicação.");
  }
  const partial = await readPrivateMedia(post.mediaKey, {
    range: "bytes=0-15",
    signal: AbortSignal.timeout(15_000),
    token,
  });
  const length = partialMediaLength(
    partial.headers.get("content-range"),
    metadata.size
  );
  const prefix = await readStreamPrefix(partial.stream, 16);
  if (partial.statusCode !== 206 || length !== 16 || prefix.byteLength !== 16) {
    throw new Error("A leitura parcial não retornou os bytes solicitados.");
  }
  let invalidRangeRejected = false;
  try {
    const unexpected = await readPrivateMedia(post.mediaKey, {
      range: `bytes=${metadata.size + 100}-`,
      signal: AbortSignal.timeout(15_000),
      token,
    });
    await unexpected.stream.cancel();
  } catch (error) {
    if (!(error instanceof ORPCError && error.status === 416)) {
      throw error;
    }
    invalidRangeRejected = true;
  }
  if (!invalidRangeRejected) {
    throw new Error("O armazenamento aceitou um intervalo fora do arquivo.");
  }
  return {
    invalidRangeStatus: 416,
    mime: metadata.contentType,
    partialBytes: prefix.byteLength,
    partialStatus: partial.statusCode,
    size: metadata.size,
    storedSignatureVerified: true,
  };
}
