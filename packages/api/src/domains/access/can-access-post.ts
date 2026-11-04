export interface AccessUser {
  id: string;
  role: string;
  status: string;
}
export interface AccessPost {
  creatorStatus: string;
  creatorUserId: string;
  creatorUserStatus: string;
  status: string;
  visibility: string;
}
export interface AccessSubscription {
  expiresAt: Date;
  status: string;
}
export function canAccessPost(
  post: AccessPost,
  user: AccessUser | null,
  subscription: AccessSubscription | null,
  now = new Date()
): boolean {
  if (user && user.status !== "ACTIVE") {
    return false;
  }
  if (user?.role === "admin" || user?.id === post.creatorUserId) {
    return true;
  }
  if (
    post.creatorStatus !== "ACTIVE" ||
    post.creatorUserStatus !== "ACTIVE" ||
    post.status !== "PUBLISHED"
  ) {
    return false;
  }
  return (
    post.visibility === "PUBLIC" ||
    Boolean(
      user && subscription?.status === "ACTIVE" && subscription.expiresAt > now
    )
  );
}
