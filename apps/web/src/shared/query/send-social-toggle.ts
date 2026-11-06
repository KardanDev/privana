import { client } from "@/utils/orpc";
import type { SocialTogglePatch } from "./social-patch";

export async function sendSocialToggle(
  patch: SocialTogglePatch
): Promise<unknown> {
  if (patch.kind === "like") {
    return await client.posts.setLike({
      liked: patch.liked,
      postId: patch.postId,
    });
  }
  if (patch.kind === "bookmark") {
    return await client.posts.setBookmark({
      bookmarked: patch.bookmarked,
      postId: patch.postId,
    });
  }
  return await client.creators.setFollow({
    creatorId: patch.creatorId,
    following: patch.following,
  });
}
