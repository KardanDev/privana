import { expect, test } from "bun:test";
import type {
  CreatorDTO,
  PageDTO,
  PostDTO,
} from "@privana/api/contracts/product";
import { type InfiniteData, QueryClient } from "@tanstack/react-query";
import { applySocialPatch } from "../../src/shared/query/apply-social-patch";
import { beginSocialPatch } from "../../src/shared/query/begin-social-patch";
import { rollbackSocialPatch } from "../../src/shared/query/rollback-social-patch";
import { undoSocialPatch } from "../../src/shared/query/undo-social-patch";
import { creator, post } from "./social-fixtures";

test("like patches every loaded post surface without changing cursors, page params or unrelated cache data", async () => {
  const client = new QueryClient();
  const page: InfiniteData<PageDTO<PostDTO>> = {
    pageParams: [undefined],
    pages: [{ items: [post], nextCursor: "cursor" }],
  };
  const studioKey = [["studio", "overview"], { status: "PUBLISHED" }];
  client.setQueryData(["social-stream", "latest"], page);
  client.setQueryData(["creator-posts", creator.id], page);
  client.setQueryData(studioKey, {
    pageParams: [undefined],
    pages: [{ metrics: { posts: 4 }, posts: [post], profile: creator }],
  });
  client.setQueryData(["settings"], { name: "A" });
  const settings = client.getQueryData(["settings"]);
  await beginSocialPatch(client, {
    kind: "like",
    liked: true,
    postId: post.id,
  });
  for (const key of [
    ["social-stream", "latest"],
    ["creator-posts", creator.id],
  ]) {
    const next = client.getQueryData<InfiniteData<PageDTO<PostDTO>>>(key);
    expect(next?.pages[0]?.items[0]).toMatchObject({
      isLiked: true,
      likeCount: 5,
    });
    expect(next?.pages[0]?.nextCursor).toBe("cursor");
    expect(next?.pageParams).toEqual([undefined]);
  }
  expect(client.getQueryData(studioKey)).toMatchObject({
    pages: [{ posts: [{ isLiked: true, likeCount: 5 }] }],
  });
  expect(client.getQueryData(["settings"])).toBe(settings);
  expect(page.pages[0]?.items[0]?.isLiked).toBe(false);
  client.clear();
});

test("a failed like restores only like fields and preserves overlapping bookmark, comment and profile edits", () => {
  const before = { items: [post], nextCursor: "same" };
  const liked = applySocialPatch(before, {
    kind: "like",
    liked: true,
    postId: post.id,
  });
  const saved = applySocialPatch(liked, {
    bookmarked: true,
    kind: "bookmark",
    postId: post.id,
  });
  const commented = applySocialPatch(saved, {
    delta: 1,
    kind: "comment",
    postId: post.id,
  });
  const followed = applySocialPatch(commented, {
    creatorId: creator.id,
    following: true,
    kind: "follow",
  });
  const restored = rollbackSocialPatch(followed, before, {
    kind: "like",
    liked: true,
    postId: post.id,
  });
  expect(restored).toMatchObject({
    items: [
      {
        bookmarkCount: 3,
        commentCount: 4,
        creator: { followerCount: 6, isFollowing: true },
        isBookmarked: true,
        isLiked: false,
        likeCount: 4,
      },
    ],
  });
});

test("failing one post's bookmark does not erase a successful bookmark on another post", async () => {
  const client = new QueryClient();
  const other = { ...post, id: "post-b" };
  const key = ["social-stream", "saved"];
  client.setQueryData(key, {
    pageParams: [undefined],
    pages: [{ items: [post, other], nextCursor: null }],
  });
  const first = await beginSocialPatch(client, {
    bookmarked: true,
    kind: "bookmark",
    postId: post.id,
  });
  await beginSocialPatch(client, {
    bookmarked: true,
    kind: "bookmark",
    postId: other.id,
  });
  undoSocialPatch(client, first, {
    bookmarked: true,
    kind: "bookmark",
    postId: post.id,
  });
  const result = client.getQueryData<InfiniteData<PageDTO<PostDTO>>>(key);
  expect(result?.pages[0]?.items.map((item) => item.isBookmarked)).toEqual([
    false,
    true,
  ]);
  client.clear();
});

test("follow changes embedded creators, discovery pages, profile and memberships consistently", async () => {
  const client = new QueryClient();
  client.setQueryData(["creator", creator.handle], creator);
  client.setQueryData(["discovery", {}], {
    pageParams: [undefined],
    pages: [{ items: [creator], nextCursor: null }],
  });
  client.setQueryData(["creator-suggestions"], {
    items: [creator],
    nextCursor: null,
  });
  client.setQueryData(
    ["memberships"],
    [{ creator, id: "interest", status: "INTEREST_REGISTERED" }]
  );
  const snapshot = await beginSocialPatch(client, {
    creatorId: creator.id,
    following: true,
    kind: "follow",
  });
  expect(
    client.getQueryData<CreatorDTO>(["creator", creator.handle])?.followerCount
  ).toBe(6);
  expect(client.getQueryData(["discovery", {}])).toMatchObject({
    pages: [{ items: [{ isFollowing: true }] }],
  });
  expect(client.getQueryData(["creator-suggestions"])).toMatchObject({
    items: [{ isFollowing: true }],
  });
  expect(client.getQueryData(["memberships"])).toMatchObject([
    { creator: { isFollowing: true } },
  ]);
  undoSocialPatch(client, snapshot, {
    creatorId: creator.id,
    following: true,
    kind: "follow",
  });
  expect(
    client.getQueryData<CreatorDTO>(["creator", creator.handle])?.isFollowing
  ).toBe(false);
  client.clear();
});

test("repeated explicit state updates do not double count and removals never become negative", () => {
  const liked = applySocialPatch(post, {
    kind: "like",
    liked: true,
    postId: post.id,
  });
  expect(
    applySocialPatch(liked, { kind: "like", liked: true, postId: post.id })
  ).toBe(liked);
  expect(
    applySocialPatch(
      { ...post, bookmarkCount: 0, isBookmarked: true },
      { bookmarked: false, kind: "bookmark", postId: post.id }
    )
  ).toMatchObject({ bookmarkCount: 0, isBookmarked: false });
});

test("a failed comment subtracts only its own increment, preserving another successful increment", () => {
  const one = applySocialPatch(post, {
    delta: 1,
    kind: "comment",
    postId: post.id,
  });
  const two = applySocialPatch(one, {
    delta: 1,
    kind: "comment",
    postId: post.id,
  });
  expect(
    rollbackSocialPatch(two, post, {
      delta: 1,
      kind: "comment",
      postId: post.id,
    })
  ).toMatchObject({ commentCount: 4 });
});
