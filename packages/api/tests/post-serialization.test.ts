import { expect, test } from "bun:test";
import { call } from "@orpc/server";
import type { Database } from "@privana/db";
import { listFeed } from "../src/domains/feed/list";
import { serializePosts } from "../src/domains/posts/serialize-posts";
import { studioOverview } from "../src/domains/studio/overview";
import { createPostSerializationFixture } from "./post-serialization-fixture";

test("a full feed page batches viewer lookups while preserving access and engagement", async () => {
  const fixture = createPostSerializationFixture();
  const { items } = await call(
    listFeed,
    { limit: 24 },
    { context: fixture.context }
  );
  expect(items).toHaveLength(24);
  expect(items[0]).toMatchObject({
    body: "secret-0",
    creator: { isFollowing: true },
    isBookmarked: false,
    isLiked: true,
    locked: false,
  });
  expect(items[1]).toMatchObject({
    body: null,
    isBookmarked: true,
    locked: true,
    mediaUrl: null,
  });
  expect(items[2]).toMatchObject({ body: null, locked: true, mediaUrl: null });
  expect(fixture.lookupCount()).toBeLessThanOrEqual(5);
});

test("a full studio page uses bounded lookups and retains owner draft access", async () => {
  const fixture = createPostSerializationFixture(true);
  const result = await call(studioOverview, undefined, {
    context: fixture.context,
  });
  expect(result.posts).toHaveLength(24);
  expect(result.posts.every((post) => !post.locked && post.body !== null)).toBe(
    true
  );
  expect(fixture.lookupCount()).toBeLessThanOrEqual(6);
});

test("anonymous feeds load current creator status once without engagement queries", async () => {
  const fixture = createPostSerializationFixture();
  const { items } = await call(
    listFeed,
    { limit: 24 },
    { context: { ...fixture.context, session: null } }
  );
  expect(
    items.every(
      (post) => post.locked && post.body === null && post.mediaUrl === null
    )
  ).toBe(true);
  expect(fixture.lookupCount()).toBe(1);
});

test("empty post pages need no serialization database queries", async () => {
  expect(await serializePosts({} as Database, [], null)).toEqual([]);
});
