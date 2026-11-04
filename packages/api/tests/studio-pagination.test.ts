import { expect, mock, test } from "bun:test";
import { call } from "@orpc/server";
import type { Database } from "@privana/db";
import type { Context } from "../src/context";
import { studioOverview } from "../src/domains/studio/overview";

interface PostQuery {
  cursor?: { id: string };
  skip?: number;
  take: number;
  where: { creatorId: string; status?: { not: string } };
}

const createFixture = () => {
  const creator = {
    _count: { followers: 10, posts: 30 },
    avatarUrl: null,
    bio: "",
    category: "Arte",
    coverUrl: null,
    displayName: "Alice",
    handle: "alice",
    id: "alice-profile",
    isDemo: false,
    location: "",
    monthlyPriceCents: 3000,
    status: "ACTIVE",
    userId: "alice",
  };
  const rows = Array.from({ length: 80 }, (_, index) => ({
    _count: { bookmarks: 0, comments: 0, likes: 0 },
    body: `Body ${index}`,
    createdAt: new Date(Date.UTC(2026, 9, 24) - index * 1000),
    creator,
    creatorId: creator.id,
    excerpt: "Preview",
    id: `post-${index}`,
    mediaKey: null,
    mediaType: null,
    previewUrl: null,
    status: index < 50 ? "ARCHIVED" : "PUBLISHED",
    title: `Post ${index}`,
    visibility: "PUBLIC",
  }));
  const postRows = mock((input: PostQuery) => {
    const start = input.cursor
      ? rows.findIndex((row) => row.id === input.cursor?.id) + (input.skip ?? 0)
      : 0;
    return rows
      .slice(start)
      .filter(
        (row) =>
          row.creatorId === input.where.creatorId &&
          row.status !== input.where.status?.not
      )
      .slice(0, input.take);
  });
  const context: Context = {
    db: {
      bookmark: { findMany: () => [] },
      creatorProfile: { findUnique: () => creator },
      follow: { findMany: () => [], findUnique: () => null },
      like: { findMany: () => [] },
      membershipInterest: { count: () => 3 },
      post: {
        count: () => rows.filter((row) => row.status !== "ARCHIVED").length,
        findMany: postRows,
      },
      subscription: { count: () => 0, findMany: () => [] },
      user: {
        findMany: () => [{ id: "alice", status: "ACTIVE" }],
        findUnique: () => ({ id: "alice", role: "member", status: "ACTIVE" }),
      },
    } as unknown as Database,
    session: { user: { id: "alice" } } as Context["session"],
  };
  return { context, postRows, rows };
};

test("studio excludes archived rows before its 24-post page limit", async () => {
  const fixture = createFixture();
  const result = await call(studioOverview, undefined, {
    context: fixture.context,
  });
  expect(fixture.postRows).toHaveBeenCalledWith(
    expect.objectContaining({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 25,
      where: { creatorId: "alice-profile", status: { not: "ARCHIVED" } },
    })
  );
  expect(result.posts).toHaveLength(24);
  expect(result.posts[0]?.id).toBe("post-50");
  expect(result.nextCursor).toBe("post-73");
  expect(result.metrics.posts).toBe(30);
});

test("studio cursor retrieves older live posts and terminates pagination", async () => {
  const fixture = createFixture();
  const first = await call(studioOverview, undefined, {
    context: fixture.context,
  });
  const second = await call(
    studioOverview,
    { cursor: first.nextCursor ?? undefined },
    { context: fixture.context }
  );
  expect(fixture.postRows).toHaveBeenLastCalledWith(
    expect.objectContaining({ cursor: { id: "post-73" }, skip: 1 })
  );
  expect(second.posts.map((post) => post.id)).toEqual([
    "post-74",
    "post-75",
    "post-76",
    "post-77",
    "post-78",
    "post-79",
  ]);
  expect(second.nextCursor).toBeNull();
});

test("refetching after archiving a page tail replaces the cursor and keeps older posts reachable", async () => {
  const fixture = createFixture();
  const first = await call(studioOverview, undefined, {
    context: fixture.context,
  });
  const tail = fixture.rows.find((row) => row.id === first.nextCursor);
  if (!tail) {
    throw new Error("Expected a full first page.");
  }
  tail.status = "ARCHIVED";
  const refreshed = await call(studioOverview, undefined, {
    context: fixture.context,
  });
  expect(refreshed.posts).toHaveLength(24);
  expect(refreshed.posts.some((post) => post.id === tail.id)).toBe(false);
  expect(refreshed.nextCursor).toBe("post-74");
  const older = await call(
    studioOverview,
    { cursor: refreshed.nextCursor ?? undefined },
    { context: fixture.context }
  );
  expect(older.posts.map((post) => post.id)).toEqual([
    "post-75",
    "post-76",
    "post-77",
    "post-78",
    "post-79",
  ]);
  expect(refreshed.metrics.posts).toBe(29);
});

test("studio pagination requires an active signed-in account", async () => {
  const fixture = createFixture();
  await expect(
    call(studioOverview, undefined, {
      context: { ...fixture.context, session: null },
    })
  ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  expect(fixture.postRows).not.toHaveBeenCalled();
});
