import type { Database } from "@privana/db";
import type { Context } from "../src/context";

export function createPostSerializationFixture(owner = false) {
  let lookups = 0;
  const now = new Date();
  const viewer = {
    id: owner ? "owner" : "reader",
    name: "Reader",
    role: "member",
    status: "ACTIVE",
  };
  const creators = ["subscribed", "expired", "suspended"].map((handle) => ({
    _count: { followers: 1, posts: 8 },
    avatarUrl: null,
    bio: "",
    category: "Arte",
    coverUrl: null,
    createdAt: now,
    displayName: handle,
    handle,
    id: handle,
    isDemo: false,
    location: "",
    monthlyPriceCents: 1000,
    status: "ACTIVE",
    updatedAt: now,
    userId: owner ? "owner" : handle,
  }));
  const posts = Array.from({ length: 24 }, (_, index) => {
    const creator = creators[index % creators.length];
    if (!creator) {
      throw new Error("Missing fixture creator");
    }
    return {
      _count: { bookmarks: 1, comments: 0, likes: 2 },
      body: `secret-${index}`,
      createdAt: now,
      creator,
      creatorId: creator.id,
      excerpt: "Public preview",
      id: `post-${index}`,
      mediaKey: `${creator.userId}/private.jpg`,
      mediaType: "image/jpeg",
      previewUrl: null,
      status: owner ? "DRAFT" : "PUBLISHED",
      title: "Title",
      updatedAt: now,
      visibility: "SUBSCRIBERS",
    };
  });
  const users = creators.map((creator) => ({
    id: creator.userId,
    status: creator.id === "suspended" ? "SUSPENDED" : "ACTIVE",
  }));
  const subscriptions = creators.map((creator) => ({
    creatorId: creator.id,
    expiresAt: new Date(
      now.getTime() + (creator.id === "expired" ? -60_000 : 60_000)
    ),
    status: "ACTIVE",
  }));
  const likes = [{ postId: "post-0" }];
  const bookmarks = [{ postId: "post-1" }];
  const follows = [{ creatorId: "subscribed" }];
  const db = {
    bookmark: {
      findMany: () => {
        lookups += 1;
        return bookmarks;
      },
      findUnique: ({
        where,
      }: {
        where: { userId_postId: { postId: string } };
      }) => {
        lookups += 1;
        return bookmarks.find(
          (row) => row.postId === where.userId_postId.postId
        );
      },
    },
    creatorProfile: { findUnique: () => creators[0] },
    follow: {
      findMany: () => {
        lookups += 1;
        return follows;
      },
      findUnique: ({
        where,
      }: {
        where: { userId_creatorId: { creatorId: string } };
      }) => {
        lookups += 1;
        return follows.find(
          (row) => row.creatorId === where.userId_creatorId.creatorId
        );
      },
    },
    like: {
      findMany: () => {
        lookups += 1;
        return likes;
      },
      findUnique: ({
        where,
      }: {
        where: { userId_postId: { postId: string } };
      }) => {
        lookups += 1;
        return likes.find((row) => row.postId === where.userId_postId.postId);
      },
    },
    membershipInterest: { count: () => 0 },
    post: { count: () => 24, findMany: () => posts },
    subscription: {
      count: () => 0,
      findMany: () => {
        lookups += 1;
        return subscriptions;
      },
      findUnique: ({
        where,
      }: {
        where: { userId_creatorId: { creatorId: string } };
      }) => {
        lookups += 1;
        return subscriptions.find(
          (row) => row.creatorId === where.userId_creatorId.creatorId
        );
      },
    },
    user: {
      findMany: () => {
        lookups += 1;
        return users;
      },
      findUnique: () => viewer,
      findUniqueOrThrow: ({ where }: { where: { id: string } }) => {
        lookups += 1;
        return users.find((user) => user.id === where.id);
      },
    },
  } as unknown as Database;
  const context: Context = {
    db,
    session: { user: { id: viewer.id } } as unknown as Context["session"],
  };
  return { context, lookupCount: () => lookups };
}
