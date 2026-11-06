import { expect, test } from "bun:test";
import { commentAttempt } from "../../src/domains/posts/comment-attempt";

test("an unchanged comment retry preserves its request ID while new content gets a new one", () => {
  const first = commentAttempt(null, "post", " Hello ", () => "first-id");
  const retry = commentAttempt(first, "post", "Hello", () => "unused-id");
  expect(retry).toBe(first);
  expect(retry.body).toBe("Hello");
  expect(
    commentAttempt(first, "post", "Changed", () => "second-id").clientCommentId
  ).toBe("second-id");
  expect(
    commentAttempt(first, "other-post", "Hello", () => "third-id")
      .clientCommentId
  ).toBe("third-id");
});
