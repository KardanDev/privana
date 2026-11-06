import type { CreatorDTO, PostDTO } from "@privana/api/contracts/product";
import type { StudioCache } from "../../src/domains/studio/studio-cache-types";

export const creator: CreatorDTO = {
  avatarUrl: null,
  bio: "Original",
  category: "Fotografia",
  coverUrl: null,
  displayName: "Luna",
  followerCount: 2,
  handle: "luna",
  id: "creator-1",
  isDemo: true,
  isFollowing: false,
  location: "São Paulo",
  monthlyPriceCents: 2990,
  postCount: 3,
  status: "ACTIVE",
  userId: "user-1",
};
export const post: PostDTO = {
  body: "Original body",
  bookmarkCount: 2,
  commentCount: 3,
  createdAt: "2026-11-01T12:00:00.000Z",
  creator,
  excerpt: "Public preview",
  id: "post-1",
  isBookmarked: false,
  isLiked: false,
  likeCount: 4,
  locked: false,
  mediaType: "image/png",
  mediaUrl: "/api/media/post-1",
  previewUrl: null,
  status: "PUBLISHED",
  title: "Original title",
  visibility: "SUBSCRIBERS",
};
export const studio: StudioCache = {
  pageParams: [undefined, "post-1"],
  pages: [
    {
      metrics: { activeSubscriptions: 0, followers: 2, interests: 3, posts: 3 },
      nextCursor: "post-1",
      posts: [post],
      profile: creator,
    },
    {
      metrics: { activeSubscriptions: 0, followers: 2, interests: 3, posts: 3 },
      nextCursor: null,
      posts: [{ ...post, id: "post-2" }],
      profile: creator,
    },
  ],
};
