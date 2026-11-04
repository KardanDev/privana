import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { assertMediaOrigin } from "./assert-media-origin";
import { mediaErrorResponse } from "./media-error-response";
import { MEDIA_RESPONSE_HEADERS, type MediaType } from "./media-policy";
import { readMediaJson } from "./read-media-json";
import { validateMediaMetadata } from "./validate-media-metadata";
import { validateMediaPath } from "./validate-media-path";

const completionSchema = z.object({ pathname: z.string().max(300) }).strict();
export interface MediaAssetInput {
  key: string;
  mimeType: MediaType;
  sizeBytes: number;
  userId: string;
}
interface CompletionDependencies {
  authUrl: string;
  getActor: (headers: Headers) => Promise<string>;
  readMetadata: (
    pathname: string,
    token: string
  ) => Promise<{ pathname: string; contentType: string; size: number }>;
  saveAsset: (asset: MediaAssetInput) => Promise<void>;
  token?: string;
}

export async function completeMediaUpload(
  request: Request,
  deps: CompletionDependencies
): Promise<Response> {
  try {
    assertMediaOrigin(request.headers, deps.authUrl);
    const userId = await deps.getActor(request.headers);
    if (!deps.token) {
      throw new ORPCError("SERVICE_UNAVAILABLE");
    }
    const { pathname } = completionSchema.parse(await readMediaJson(request));
    const mediaType = validateMediaPath(pathname, userId);
    const blob = await deps.readMetadata(pathname, deps.token);
    validateMediaMetadata(blob, pathname, mediaType);
    await deps.saveAsset({
      key: pathname,
      mimeType: mediaType,
      sizeBytes: blob.size,
      userId,
    });
    return Response.json(
      { mediaKey: pathname, mediaType },
      { headers: MEDIA_RESPONSE_HEADERS }
    );
  } catch (error) {
    return mediaErrorResponse(error);
  }
}
