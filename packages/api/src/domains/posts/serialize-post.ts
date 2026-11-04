import type { Database } from "@privana/db";
import type { PostDTO } from "../../contracts/product";
import type { AccessUser } from "../access/can-access-post";
import { canAccessPost } from "../access/can-access-post";
import { serializeCreator } from "../creators/serialize-creator";
import type {
  PostSerializationRecord,
  PostSerializationState,
} from "./load-post-serialization-state";
import { loadPostSerializationState } from "./load-post-serialization-state";
export async function serializePost(
  db: Database,
  post: PostSerializationRecord,
  viewer: AccessUser | null,
  state?: PostSerializationState
): Promise<PostDTO> {
  const current =
    state ??
    (await loadPostSerializationState(db, [post], viewer)).get(post.id);
  if (!current) {
    throw new Error("Post serialization state is unavailable.");
  }
  const access = canAccessPost(
    {
      creatorStatus: post.creator.status,
      creatorUserId: post.creator.userId,
      creatorUserStatus: current.creatorUserStatus,
      status: post.status,
      visibility: post.visibility,
    },
    viewer,
    current.subscription
  );
  return {
    body: access ? post.body : null,
    bookmarkCount: post._count.bookmarks,
    commentCount: post._count.comments,
    createdAt: post.createdAt.toISOString(),
    creator: await serializeCreator(
      db,
      post.creator,
      viewer?.id,
      current.isFollowing
    ),
    excerpt: post.excerpt,
    id: post.id,
    isBookmarked: current.isBookmarked,
    isLiked: current.isLiked,
    likeCount: post._count.likes,
    locked: !access,
    mediaType: access ? post.mediaType : null,
    mediaUrl: access && post.mediaKey ? `/api/media/${post.id}` : null,
    previewUrl: post.previewUrl,
    status: post.status,
    title: post.title,
    visibility: post.visibility,
  };
}
