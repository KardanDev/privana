import { expect, test } from "bun:test";
import { applySocialPatch } from "../../src/shared/query/apply-social-patch";
import { rollbackSocialPatch } from "../../src/shared/query/rollback-social-patch";
import { creator, post } from "./social-fixtures";

test("a late failed like preserves a refreshed flag and count", () => {
  const refreshed = { ...post, isLiked: true, likeCount: 12 };
  expect(
    rollbackSocialPatch(refreshed, post, {
      kind: "like",
      liked: true,
      postId: post.id,
    })
  ).toEqual(refreshed);
});

test("a late failed bookmark preserves a refreshed flag and count", () => {
  const refreshed = { ...post, bookmarkCount: 12, isBookmarked: true };
  expect(
    rollbackSocialPatch(refreshed, post, {
      bookmarked: true,
      kind: "bookmark",
      postId: post.id,
    })
  ).toEqual(refreshed);
});

test("a late failed follow preserves a refreshed relationship and count", () => {
  const refreshed = { ...creator, followerCount: 12, isFollowing: true };
  expect(
    rollbackSocialPatch(refreshed, creator, {
      creatorId: creator.id,
      following: true,
      kind: "follow",
    })
  ).toEqual(refreshed);
});

test("a refreshed toggle flag wins even when the count still matches the optimistic value", () => {
  const refreshed = { ...post, likeCount: 5 };
  expect(
    rollbackSocialPatch(refreshed, post, {
      kind: "like",
      liked: true,
      postId: post.id,
    })
  ).toEqual(refreshed);
});

test("rollback restores an unchanged removal at the nonnegative count floor", () => {
  const before = { ...post, isLiked: true, likeCount: 0 };
  const patch = { kind: "like", liked: false, postId: post.id } as const;
  const removed = applySocialPatch(before, patch);
  expect(removed).toMatchObject({ isLiked: false, likeCount: 0 });
  expect(rollbackSocialPatch(removed, before, patch)).toEqual(before);
});

test("follow rollback matches each embedded creator's original count", () => {
  const before = [
    post,
    { ...post, creator: { ...creator, followerCount: 8 }, id: "other" },
  ];
  const patch = {
    creatorId: creator.id,
    following: true,
    kind: "follow",
  } as const;
  expect(
    rollbackSocialPatch(applySocialPatch(before, patch), before, patch)
  ).toEqual(before);
});

test("like rollback matches repeated post snapshots with different counts", () => {
  const before = [post, { ...post, likeCount: 8 }];
  const patch = { kind: "like", liked: true, postId: post.id } as const;
  expect(
    rollbackSocialPatch(applySocialPatch(before, patch), before, patch)
  ).toEqual(before);
});

for (const patch of [
  { kind: "like", liked: false, postId: post.id },
  { bookmarked: false, kind: "bookmark", postId: post.id },
  { creatorId: creator.id, following: false, kind: "follow" },
] as const) {
  test(`${patch.kind} removal retains each floor-colliding and already-target snapshot`, () => {
    const before = [
      { active: true, count: 0 },
      { active: true, count: 1 },
      { active: false, count: 0 },
    ].map(({ active, count }) => ({
      ...post,
      bookmarkCount: count,
      creator: { ...creator, followerCount: count, isFollowing: active },
      isBookmarked: active,
      isLiked: active,
      likeCount: count,
    }));
    expect(
      rollbackSocialPatch(applySocialPatch(before, patch), before, patch)
    ).toEqual(before);
  });
}

test("a newer first occurrence does not lend its snapshot to a later colliding record", () => {
  const zero = { ...post, isLiked: true, likeCount: 0 };
  const one = { ...zero, likeCount: 1 };
  const current = [
    { ...zero, likeCount: 12 },
    { ...one, isLiked: false, likeCount: 0 },
  ];
  expect(
    rollbackSocialPatch(current, [zero, one], {
      kind: "like",
      liked: false,
      postId: post.id,
    })
  ).toEqual([current[0], one]);
});
