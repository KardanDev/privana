import { mapSocialData } from "./map-social-data";
import type { SocialPatch } from "./social-patch";

export function applySocialPatch(data: unknown, patch: SocialPatch): unknown {
  return mapSocialData(data, {
    creator: (creator) => {
      if (
        patch.kind !== "follow" ||
        creator.id !== patch.creatorId ||
        creator.isFollowing === patch.following
      ) {
        return creator;
      }
      return {
        ...creator,
        followerCount: Math.max(
          0,
          creator.followerCount + (patch.following ? 1 : -1)
        ),
        isFollowing: patch.following,
      };
    },
    post: (post) => {
      if (patch.kind === "follow" || post.id !== patch.postId) {
        return post;
      }
      if (patch.kind === "like" && post.isLiked !== patch.liked) {
        return {
          ...post,
          isLiked: patch.liked,
          likeCount: Math.max(0, post.likeCount + (patch.liked ? 1 : -1)),
        };
      }
      if (patch.kind === "bookmark" && post.isBookmarked !== patch.bookmarked) {
        return {
          ...post,
          bookmarkCount: Math.max(
            0,
            post.bookmarkCount + (patch.bookmarked ? 1 : -1)
          ),
          isBookmarked: patch.bookmarked,
        };
      }
      if (patch.kind === "comment") {
        return {
          ...post,
          commentCount: Math.max(0, post.commentCount + patch.delta),
        };
      }
      return post;
    },
  });
}
