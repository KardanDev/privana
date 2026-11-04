import type { Database } from "@privana/db";
import type { Prisma } from "@privana/db/client";
import type { AccessSubscription, AccessUser } from "../access/can-access-post";
import type { postInclude } from "../shared/query-shapes";

export type PostSerializationRecord = Prisma.PostGetPayload<{
  include: typeof postInclude;
}>;

export interface PostSerializationState {
  creatorUserStatus: string;
  isBookmarked: boolean;
  isFollowing: boolean;
  isLiked: boolean;
  subscription: AccessSubscription | null;
}

export async function loadPostSerializationState(
  db: Database,
  posts: PostSerializationRecord[],
  viewer: AccessUser | null
): Promise<Map<string, PostSerializationState>> {
  if (posts.length === 0) {
    return new Map();
  }
  const postIds = posts.map((post) => post.id);
  const creatorIds = [...new Set(posts.map((post) => post.creatorId))];
  const userIds = [...new Set(posts.map((post) => post.creator.userId))];
  const [users, subscriptions, likes, bookmarks, follows] = await Promise.all([
    db.user.findMany({
      select: { id: true, status: true },
      take: userIds.length,
      where: { id: { in: userIds } },
    }),
    viewer
      ? db.subscription.findMany({
          select: { creatorId: true, expiresAt: true, status: true },
          take: creatorIds.length,
          where: { creatorId: { in: creatorIds }, userId: viewer.id },
        })
      : [],
    viewer
      ? db.like.findMany({
          select: { postId: true },
          take: postIds.length,
          where: { postId: { in: postIds }, userId: viewer.id },
        })
      : [],
    viewer
      ? db.bookmark.findMany({
          select: { postId: true },
          take: postIds.length,
          where: { postId: { in: postIds }, userId: viewer.id },
        })
      : [],
    viewer
      ? db.follow.findMany({
          select: { creatorId: true },
          take: creatorIds.length,
          where: { creatorId: { in: creatorIds }, userId: viewer.id },
        })
      : [],
  ]);
  const userStatuses = new Map(users.map((user) => [user.id, user.status]));
  const subscriptionsByCreator = new Map(
    subscriptions.map((subscription) => [subscription.creatorId, subscription])
  );
  const likedPosts = new Set(likes.map((like) => like.postId));
  const bookmarkedPosts = new Set(bookmarks.map((bookmark) => bookmark.postId));
  const followedCreators = new Set(follows.map((follow) => follow.creatorId));
  return new Map(
    posts.map((post) => [
      post.id,
      {
        creatorUserStatus: userStatuses.get(post.creator.userId) ?? "SUSPENDED",
        isBookmarked: bookmarkedPosts.has(post.id),
        isFollowing: followedCreators.has(post.creatorId),
        isLiked: likedPosts.has(post.id),
        subscription: subscriptionsByCreator.get(post.creatorId) ?? null,
      },
    ])
  );
}
