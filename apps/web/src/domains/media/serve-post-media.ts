import { ORPCError } from "@orpc/server";
import { mediaErrorResponse } from "./media-error-response";
import { MEDIA_RESPONSE_HEADERS } from "./media-policy";
import { partialMediaLength } from "./partial-media-length";
import type { MediaReadOptions, PrivateMediaResult } from "./types";
import { validateMediaMetadata } from "./validate-media-metadata";
import { validateMediaPath } from "./validate-media-path";

const SINGLE_RANGE = /^bytes=(?:\d+-\d*|-\d+)$/;
interface DeliveryDependencies {
  authorize: (
    postId: string
  ) => Promise<{ key: string | null; type: string | null }>;
  readBlob: (
    key: string,
    options: MediaReadOptions
  ) => Promise<PrivateMediaResult | null>;
  token?: string;
}

export async function servePostMedia(
  request: Request,
  postId: string,
  deps: DeliveryDependencies
): Promise<Response> {
  try {
    const media = await deps.authorize(postId);
    if (!(media.key && media.type)) {
      throw new ORPCError("NOT_FOUND");
    }
    const owner = media.key.split("/")[0] ?? "";
    const mime = validateMediaPath(media.key, owner);
    if (media.type !== mime) {
      throw new ORPCError("NOT_FOUND");
    }
    if (!deps.token) {
      throw new ORPCError("SERVICE_UNAVAILABLE");
    }
    const range = request.headers.get("range");
    if (range && (range.length > 128 || !SINGLE_RANGE.test(range))) {
      return Response.json(
        { error: "O intervalo solicitado é inválido." },
        { headers: MEDIA_RESPONSE_HEADERS, status: 416 }
      );
    }
    const result = await deps.readBlob(media.key, {
      signal: request.signal,
      token: deps.token,
      ...(range ? { range } : {}),
    });
    if (!(result && [200, 206].includes(result.statusCode))) {
      throw new ORPCError("NOT_FOUND");
    }
    try {
      validateMediaMetadata(result.blob, media.key, mime);
    } catch (error) {
      await result.stream.cancel();
      throw error;
    }
    const headers = new Headers({
      ...MEDIA_RESPONSE_HEADERS,
      "Content-Disposition": "inline",
      "Content-Length": String(result.blob.size),
      "Content-Type": mime,
    });
    const contentRange = result.headers.get("content-range");
    const partial = result.statusCode === 206;
    if (partial) {
      try {
        if (!range) {
          throw new ORPCError("BAD_GATEWAY");
        }
        headers.set(
          "Content-Length",
          String(partialMediaLength(contentRange, result.blob.size))
        );
        headers.set("Content-Range", contentRange ?? "");
        headers.set("Accept-Ranges", "bytes");
      } catch (error) {
        await result.stream.cancel();
        throw error;
      }
    }
    return new Response(result.stream, {
      headers,
      status: partial ? 206 : 200,
    });
  } catch (error) {
    return mediaErrorResponse(error);
  }
}
