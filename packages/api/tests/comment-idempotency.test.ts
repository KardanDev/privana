import { expect, test } from "bun:test";
import { call } from "@orpc/server";
import { addComment } from "../src/domains/posts/add-comment";
import { commentIdempotencyFixture } from "./comment-idempotency-fixture";

const clientCommentId = "0fc8d14f-65c3-4229-a44a-4e6a25bdbb25";
const input = { body: "A comment", clientCommentId, postId: "public-post" };

test("twenty concurrent comment retries return one record and its original timestamp", async () => {
  const fixture = commentIdempotencyFixture();
  const results = await Promise.all(
    Array.from(
      { length: 20 },
      async () => await call(addComment, input, { context: fixture.context() })
    )
  );
  expect(fixture.rows.size).toBe(1);
  expect(new Set(results.map((result) => result.id))).toEqual(
    new Set([clientCommentId])
  );
  expect(new Set(results.map((result) => result.createdAt))).toEqual(
    new Set(["2026-11-06T12:00:00.000Z"])
  );
  expect(fixture.createMany).toHaveBeenCalledWith({
    data: [
      {
        body: "A comment",
        id: clientCommentId,
        postId: "public-post",
        userId: "member",
      },
    ],
    skipDuplicates: true,
  });
});

test("trimmed bodies and uppercase UUID retries preserve the original response", async () => {
  const fixture = commentIdempotencyFixture();
  const first = await call(addComment, input, { context: fixture.context() });
  const retry = await call(
    addComment,
    {
      ...input,
      body: " A comment ",
      clientCommentId: clientCommentId.toUpperCase(),
    },
    { context: fixture.context() }
  );
  expect(retry).toEqual(first);
  expect(fixture.rows.size).toBe(1);
});

test.each([
  { body: "Changed content", postId: "public-post", userId: "member" },
  { body: "A comment", postId: "other-public-post", userId: "member" },
  { body: "A comment", postId: "public-post", userId: "another-member" },
])(
  "a comment ID cannot be reused for another content, post or author: %j",
  async (reuse) => {
    const fixture = commentIdempotencyFixture();
    await call(addComment, input, { context: fixture.context() });
    await expect(
      call(
        addComment,
        { ...input, body: reuse.body, postId: reuse.postId },
        { context: fixture.context(reuse.userId) }
      )
    ).rejects.toMatchObject({ code: "CONFLICT" });
    expect(fixture.rows.size).toBe(1);
  }
);

test("a known comment ID cannot bypass revoked subscription, hidden post or suspended creator access", async () => {
  const fixture = commentIdempotencyFixture();
  await call(addComment, input, { context: fixture.context() });
  fixture.state.visibility = "SUBSCRIBERS";
  await expect(
    call(addComment, input, { context: fixture.context() })
  ).rejects.toMatchObject({ code: "FORBIDDEN" });
  fixture.state.subscribed = true;
  fixture.state.postStatus = "ARCHIVED";
  await expect(
    call(addComment, input, { context: fixture.context() })
  ).rejects.toMatchObject({ code: "FORBIDDEN" });
  fixture.state.postStatus = "PUBLISHED";
  fixture.state.creatorStatus = "SUSPENDED";
  await expect(
    call(addComment, input, { context: fixture.context() })
  ).rejects.toMatchObject({ code: "FORBIDDEN" });
  expect(fixture.findUnique).toHaveBeenCalledTimes(1);
});

test("suspended viewers and unknown posts are denied before reading an existing request ID", async () => {
  const fixture = commentIdempotencyFixture();
  fixture.state.viewerStatus = "SUSPENDED";
  await expect(
    call(addComment, input, { context: fixture.context() })
  ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  fixture.state.viewerStatus = "ACTIVE";
  await expect(
    call(
      addComment,
      { ...input, postId: "missing" },
      { context: fixture.context() }
    )
  ).rejects.toMatchObject({ code: "NOT_FOUND" });
  expect(fixture.findUnique).not.toHaveBeenCalled();
  expect(fixture.transaction).not.toHaveBeenCalled();
});

test("malformed IDs fail validation and legacy clients retain independent comments", async () => {
  const fixture = commentIdempotencyFixture();
  await expect(
    call(
      addComment,
      { ...input, clientCommentId: "malformed" },
      { context: fixture.context() }
    )
  ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  expect(fixture.transaction).not.toHaveBeenCalled();
  const first = await call(
    addComment,
    { body: input.body, postId: input.postId },
    { context: fixture.context() }
  );
  const second = await call(
    addComment,
    { body: input.body, postId: input.postId },
    { context: fixture.context() }
  );
  expect(first.id).not.toBe(second.id);
});
