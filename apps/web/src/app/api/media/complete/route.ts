import { authorizeUploadActor } from "@/domains/media/authorize-upload-actor";
import { completeMediaUpload } from "@/domains/media/complete-media-upload";
import { readMediaMetadata } from "@/domains/media/read-media-metadata";
import { ENV } from "@/env.server";
import { db } from "@/services";

export async function POST(request: Request): Promise<Response> {
  return await completeMediaUpload(request, {
    authUrl: ENV.BETTER_AUTH_URL,
    getActor: authorizeUploadActor,
    readMetadata: readMediaMetadata,
    saveAsset: async (asset) => {
      await db.mediaAsset.upsert({
        create: asset,
        update: {},
        where: { key: asset.key },
      });
    },
    token: ENV.UPSTASH_BLOB_TOKEN,
  });
}
