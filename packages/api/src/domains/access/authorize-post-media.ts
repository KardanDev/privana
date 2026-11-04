import { ORPCError } from "@orpc/server";
import type { Database } from "@privana/db";
import type { AccessUser } from "./can-access-post";
import { canAccessPost } from "./can-access-post";
import { canReviewReportedMedia } from "./can-review-reported-media";
export async function authorizePostMedia(
  db: Database,
  postId: string,
  userId?: string
) {
  const post = await db.post.findUnique({
    include: { creator: { include: { user: { select: { status: true } } } } },
    where: { id: postId },
  });
  if (!post) {
    throw new ORPCError("NOT_FOUND");
  }
  const viewer: AccessUser | null = userId
    ? await db.user.findUnique({
        select: { id: true, role: true, status: true },
        where: { id: userId },
      })
    : null;
  const subscription = viewer
    ? await db.subscription.findUnique({
        where: {
          userId_creatorId: { creatorId: post.creatorId, userId: viewer.id },
        },
      })
    : null;
  if (
    !(
      canAccessPost(
        {
          creatorStatus: post.creator.status,
          creatorUserId: post.creator.userId,
          creatorUserStatus: post.creator.user.status,
          status: post.status,
          visibility: post.visibility,
        },
        viewer,
        subscription
      ) || (await canReviewReportedMedia(db, postId, viewer))
    )
  ) {
    throw new ORPCError("FORBIDDEN");
  }
  return { key: post.mediaKey, type: post.mediaType };
}
