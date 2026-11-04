import { expect, test } from "bun:test";
import { mergeMessagePages } from "../../src/domains/messages/merge-message-pages";

test("overlapping history pages deduplicate messages, preserve the fresh copy, and sort by timestamp then ID", () => {
  const older = {
    body: "older",
    createdAt: "2026-10-24T12:00:00Z",
    id: "a",
    senderId: "alice",
  };
  const middle = {
    body: "middle",
    createdAt: "2026-10-24T12:01:00Z",
    id: "b",
    senderId: "alice",
  };
  const latest = {
    body: "fresh",
    createdAt: "2026-10-24T12:01:00Z",
    id: "c",
    senderId: "bob",
  };
  const result = mergeMessagePages([
    [latest],
    [middle, { ...latest, body: "stale" }],
    [older],
  ]);
  expect(result.map((message) => message.id)).toEqual(["a", "b", "c"]);
  expect(result.at(-1)?.body).toBe("fresh");
});
