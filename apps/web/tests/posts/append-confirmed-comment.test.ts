import { expect, test } from "bun:test";
import { appendConfirmedComment } from "../../src/domains/posts/append-confirmed-comment";

const comment = {
  author: { id: "member", image: null, name: "Camila" },
  body: "Hello",
  createdAt: "2026-11-06T12:00:00Z",
  id: "comment-a",
};

test("a confirmed comment appears immediately even before the first list load and duplicate confirmations do not duplicate it", () => {
  const first = appendConfirmedComment(undefined, comment);
  expect(first.pages[0]?.items).toEqual([comment]);
  expect(appendConfirmedComment(first, comment)).toBe(first);
});

test("adding a confirmed comment preserves historical pages and their cursors", () => {
  const earlier = {
    pageParams: [undefined, "next"],
    pages: [
      { items: [{ ...comment, id: "older" }], nextCursor: "next" },
      { items: [], nextCursor: "further" },
    ],
  };
  const next = appendConfirmedComment(earlier, comment);
  expect(next.pages[0]).toBe(earlier.pages[0]);
  expect(next.pages[1]?.nextCursor).toBe("further");
  expect(next.pages[1]?.items).toEqual([comment]);
  expect(next.pageParams).toBe(earlier.pageParams);
});
