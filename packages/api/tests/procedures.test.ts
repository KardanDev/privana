import { expect, test } from "bun:test";
import { call } from "@orpc/server";
import type { Database } from "@privana/db";
import type { Context } from "../src/context";
import { adminOverview } from "../src/domains/admin/overview";
import { listMemberships } from "../src/domains/memberships/list";
import { getMessages } from "../src/domains/messages/get";
import { serializePost } from "../src/domains/posts/serialize-post";
import { updateSettings } from "../src/domains/settings/update";
import { savePost } from "../src/domains/studio/save-post";

const viewer = { id: "alice", name: "Alice", role: "member", status: "ACTIVE" };
const contextFor = (database: unknown): Context => ({
  db: database as Database,
  session: {
    user: { id: "alice", role: "admin" },
  } as unknown as Context["session"],
});

test("a stale admin session cannot enter administration after DB demotion", async () => {
  const context = contextFor({ user: { findUnique: () => viewer } });
  await expect(
    call(adminOverview, undefined, { context })
  ).rejects.toMatchObject({ code: "FORBIDDEN" });
});

test("suspended users cannot mutate settings with an otherwise valid session", async () => {
  const context = contextFor({
    user: { findUnique: () => ({ ...viewer, status: "SUSPENDED" }) },
  });
  await expect(
    call(
      updateSettings,
      { emailNotifications: true, name: "Alice" },
      { context }
    )
  ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
});

test("guessed conversation IDs do not disclose messages", async () => {
  const context = contextFor({
    conversation: {
      findUnique: () => ({
        id: "private",
        participantAId: "bob",
        participantBId: "carol",
      }),
    },
    user: { findUnique: () => viewer },
  });
  await expect(
    call(getMessages, { conversationId: "private" }, { context })
  ).rejects.toMatchObject({ code: "FORBIDDEN" });
});

test("cross-user post IDs cannot be edited", async () => {
  const context = contextFor({
    creatorProfile: {
      findUnique: () => ({ id: "alice-profile", status: "ACTIVE" }),
    },
    post: { findUnique: () => ({ creator: { userId: "bob" } }) },
    user: { findUnique: () => viewer },
  });
  await expect(
    call(
      savePost,
      {
        body: "Changed body",
        excerpt: "",
        id: "bobs-post",
        status: "PUBLISHED",
        title: "Changed",
        visibility: "PUBLIC",
      },
      { context }
    )
  ).rejects.toMatchObject({ code: "FORBIDDEN" });
});

test("media keys must refer to a confirmed asset owned by the current creator", async () => {
  const context = contextFor({
    creatorProfile: {
      findUnique: () => ({ id: "alice-profile", status: "ACTIVE" }),
    },
    mediaAsset: {
      findUnique: () => ({ mimeType: "image/jpeg", userId: "bob" }),
    },
    user: { findUnique: () => viewer },
  });
  await expect(
    call(
      savePost,
      {
        body: "Secret",
        excerpt: "",
        mediaKey: "bob/private.jpg",
        mediaType: "image/jpeg",
        status: "PUBLISHED",
        title: "Photo",
        visibility: "SUBSCRIBERS",
      },
      { context }
    )
  ).rejects.toMatchObject({ code: "BAD_REQUEST" });
});

test("premium serialization strips body, storage key and media URLs for anonymous viewers", async () => {
  const creator = {
    _count: { followers: 0, posts: 1 },
    avatarUrl: null,
    bio: "",
    category: "Arte",
    coverUrl: null,
    createdAt: new Date(),
    displayName: "Owner",
    handle: "owner",
    id: "creator",
    isDemo: false,
    location: "",
    monthlyPriceCents: 5000,
    status: "ACTIVE",
    updatedAt: new Date(),
    userId: "owner",
  };
  const post = {
    _count: { bookmarks: 0, comments: 0, likes: 0 },
    body: "PRIVATE BODY",
    createdAt: new Date(),
    creator,
    creatorId: creator.id,
    excerpt: "Safe excerpt",
    id: "post",
    mediaKey: "owner/private.jpg",
    mediaType: "image/jpeg",
    previewUrl: null,
    status: "PUBLISHED",
    title: "Preview",
    updatedAt: new Date(),
    visibility: "SUBSCRIBERS",
  };
  const db = {
    user: { findMany: () => [{ id: "owner", status: "ACTIVE" }] },
  } as unknown as Database;
  const result = await serializePost(db, post, null);
  expect(result.locked).toBe(true);
  expect(result.body).toBeNull();
  expect(result.mediaUrl).toBeNull();
  expect(JSON.stringify(result)).not.toContain("PRIVATE BODY");
  expect(JSON.stringify(result)).not.toContain("owner/private.jpg");
});

test("validation rejects oversized content before any database mutation", async () => {
  const context = contextFor({ user: { findUnique: () => viewer } });
  await expect(
    call(
      savePost,
      {
        body: "Text",
        excerpt: "",
        status: "PUBLISHED",
        title: "x".repeat(161),
        visibility: "PUBLIC",
      },
      { context }
    )
  ).rejects.toMatchObject({ code: "BAD_REQUEST" });
});

test("launch interest persists in memberships without becoming active access", async () => {
  const creator = {
    _count: { followers: 0, posts: 1 },
    avatarUrl: null,
    bio: "",
    category: "Arte",
    coverUrl: null,
    displayName: "Owner",
    handle: "owner",
    id: "creator",
    isDemo: false,
    location: "",
    monthlyPriceCents: 5000,
    status: "ACTIVE",
    userId: "owner",
  };
  const context = contextFor({
    follow: { findUnique: () => null },
    membershipInterest: { findMany: () => [{ creator, id: "interest" }] },
    subscription: { findMany: () => [] },
    user: { findUnique: () => viewer },
  });
  const results = await call(listMemberships, undefined, { context });
  expect(results).toHaveLength(1);
  expect(results[0]?.status).toBe("INTEREST_REGISTERED");
  expect(results[0]?.expiresAt).toBeNull();
});
