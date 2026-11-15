import type { CreatorDTO, PostDTO } from "@privana/api/contracts/product";
import { isUnchangedSocialToggle } from "./is-unchanged-social-toggle";
import { mapSocialData } from "./map-social-data";
import type { SocialPatch } from "./social-patch";

export function rollbackSocialPatch(
  current: unknown,
  previousData: unknown,
  patch: SocialPatch
): unknown {
  const previousPosts: PostDTO[] = [];
  const previousCreators: CreatorDTO[] = [];
  mapSocialData(previousData, {
    creator: (creator) => {
      if (patch.kind === "follow" && creator.id === patch.creatorId) {
        previousCreators.push(creator);
      }
      return creator;
    },
    post: (post) => {
      if (patch.kind !== "follow" && post.id === patch.postId) {
        previousPosts.push(post);
      }
      return post;
    },
  });
  // Each occurrence owns one snapshot; zero-floor projections can collide.
  return mapSocialData(current, {
    creator: (creator) => {
      if (patch.kind !== "follow" || creator.id !== patch.creatorId) {
        return creator;
      }
      const previousCreator = previousCreators.shift();
      return previousCreator &&
        isUnchangedSocialToggle(
          { active: creator.isFollowing, count: creator.followerCount },
          {
            active: previousCreator.isFollowing,
            count: previousCreator.followerCount,
          },
          patch.following
        )
        ? {
            ...creator,
            followerCount: previousCreator.followerCount,
            isFollowing: previousCreator.isFollowing,
          }
        : creator;
    },
    post: (post) => {
      if (
        patch.kind === "follow" ||
        post.id !== patch.postId ||
        previousPosts.length === 0
      ) {
        return post;
      }
      if (patch.kind === "like") {
        const previousPost = previousPosts.shift();
        return previousPost &&
          isUnchangedSocialToggle(
            { active: post.isLiked, count: post.likeCount },
            { active: previousPost.isLiked, count: previousPost.likeCount },
            patch.liked
          )
          ? {
              ...post,
              isLiked: previousPost.isLiked,
              likeCount: previousPost.likeCount,
            }
          : post;
      }
      if (patch.kind === "bookmark") {
        const previousPost = previousPosts.shift();
        return previousPost &&
          isUnchangedSocialToggle(
            { active: post.isBookmarked, count: post.bookmarkCount },
            {
              active: previousPost.isBookmarked,
              count: previousPost.bookmarkCount,
            },
            patch.bookmarked
          )
          ? {
              ...post,
              bookmarkCount: previousPost.bookmarkCount,
              isBookmarked: previousPost.isBookmarked,
            }
          : post;
      }
      return {
        ...post,
        commentCount: Math.max(0, post.commentCount - patch.delta),
      };
    },
  });
}
