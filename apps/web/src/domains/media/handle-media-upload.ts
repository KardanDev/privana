import { ORPCError } from "@orpc/server";
import { Bucket, uploadHandler } from "@upstash/blob";
import { assertMediaOrigin } from "./assert-media-origin";
import { mediaErrorResponse } from "./media-error-response";
import {
  MAX_MEDIA_BYTES,
  MEDIA_EXTENSIONS,
  MEDIA_RESPONSE_HEADERS,
} from "./media-policy";
import { prepareMediaUpload } from "./prepare-media-upload";
import { readMediaJson } from "./read-media-json";
import { validateMediaPath } from "./validate-media-path";

interface UploadDependencies {
  authUrl: string;
  getActor: (headers: Headers) => Promise<string>;
  token?: string;
}

export async function handleMediaUpload(
  request: Request,
  deps: UploadDependencies
): Promise<Response> {
  try {
    if (!deps.token) {
      throw new ORPCError("SERVICE_UNAVAILABLE");
    }
    // Authenticate every phase, including retries and finalization.
    assertMediaOrigin(request.headers, deps.authUrl);
    const userId = await deps.getActor(request.headers);
    const body = await readMediaJson(request);
    const sdkRequest = new Request(request.url, {
      body: JSON.stringify(body),
      headers: request.headers,
      method: "POST",
      signal: request.signal,
    });
    const bucket = new Bucket({ cache: "no-store", token: deps.token });
    const handler = uploadHandler({
      bucket,
      constraints: {
        contentTypes: Object.keys(MEDIA_EXTENSIONS),
        maxSize: MAX_MEDIA_BYTES,
      },
      endpoint: "/api/media/upload",
      multipart: true,
      onBeforeUpload: async ({ file }) => {
        const prepared = prepareMediaUpload(file, userId);
        // Refuse a mistakenly configured public bucket before signing a write.
        if (await bucket.publicUrl(prepared.path)) {
          throw new ORPCError("SERVICE_UNAVAILABLE");
        }
        return prepared;
      },
      onError: ({ error }) => mediaErrorResponse(error),
      onUploadComplete: ({ path }) => {
        validateMediaPath(path, userId);
        return { path };
      },
    });
    const response = await handler.POST(sdkRequest);
    for (const [key, value] of Object.entries(MEDIA_RESPONSE_HEADERS)) {
      response.headers.set(key, value);
    }
    return response;
  } catch (error) {
    return mediaErrorResponse(error);
  }
}
