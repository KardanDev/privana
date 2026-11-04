import { authorizePostMedia } from "@privana/api/domains/access/authorize-post-media";
import { readPrivateMedia } from "@/domains/media/read-private-media";
import { servePostMedia } from "@/domains/media/serve-post-media";
import { ENV } from "@/env.server";
import { auth, db } from "@/services";

export async function GET(
  request: Request,
  context: { params: Promise<{ postId: string }> }
): Promise<Response> {
  const { postId } = await context.params;
  return await servePostMedia(request, postId, {
    authorize: async (id) => {
      const session = await auth.api.getSession({ headers: request.headers });
      return await authorizePostMedia(db, id, session?.user.id);
    },
    readBlob: readPrivateMedia,
    token: ENV.UPSTASH_BLOB_TOKEN,
  });
}
