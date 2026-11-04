import { authorizeUploadActor } from "@/domains/media/authorize-upload-actor";
import { handleMediaUpload } from "@/domains/media/handle-media-upload";
import { ENV } from "@/env.server";

export async function POST(request: Request): Promise<Response> {
  return await handleMediaUpload(request, {
    authUrl: ENV.BETTER_AUTH_URL,
    getActor: authorizeUploadActor,
    token: ENV.UPSTASH_BLOB_TOKEN,
  });
}
