import type { CreatorDTO, PostDTO } from "@privana/api/contracts/product";
import { mapSocialData } from "./map-social-data";
import type { SocialPatch } from "./social-patch";

export function rollbackSocialPatch(
  current: unknown,
  previous: unknown,
  patch: SocialPatch
): unknown {
  let previousPost: PostDTO | undefined;
  let previousCreator: CreatorDTO | undefined;
  mapSocialData(previous, {
    creator: (creator) => {
      if (patch.kind === "follow" && creator.id === patch.creatorId) {
        previousCreator = creator;
      }
      return creator;
    },
    post: (post) => {
      if (patch.kind !== "follow" && post.id === patch.postId) {
        previousPost = post;
      }
      return post;
    },
  });
  // Restore only this action's fields: a failing like must not erase a newer bookmark/comment.
  return mapSocialData(current, {
    creator: (creator) =>
      patch.kind === "follow" &&
      creator.id === patch.creatorId &&
      previousCreator
        ? {
            ...creator,
            followerCount: previousCreator.followerCount,
            isFollowing: previousCreator.isFollowing,
          }
        : creator,
    post: (post) => {
      if (
        patch.kind === "follow" ||
        post.id !== patch.postId ||
        !previousPost
      ) {
        return post;
      }
      if (patch.kind === "like") {
        return {
          ...post,
          isLiked: previousPost.isLiked,
          likeCount: previousPost.likeCount,
        };
      }
      if (patch.kind === "bookmark") {
        return {
          ...post,
          bookmarkCount: previousPost.bookmarkCount,
          isBookmarked: previousPost.isBookmarked,
        };
      }
      return {
        ...post,
        commentCount: Math.max(0, post.commentCount - patch.delta),
      };
    },
  });
}
