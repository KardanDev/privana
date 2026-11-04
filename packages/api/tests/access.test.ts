import { expect, test } from "bun:test";
import { canAccessPost } from "../src/domains/access/can-access-post";
import { requireOwner } from "../src/domains/access/require-owner";
import { requireParticipant } from "../src/domains/access/require-participant";

const now = new Date("2026-10-23T12:00:00Z");
const post = {
  creatorStatus: "ACTIVE",
  creatorUserId: "owner",
  creatorUserStatus: "ACTIVE",
  status: "PUBLISHED",
  visibility: "SUBSCRIBERS",
};
test("anonymous users and expired subscribers cannot access premium content", () => {
  expect(canAccessPost(post, null, null, now)).toBe(false);
  expect(
    canAccessPost(
      post,
      { id: "member", role: "member", status: "ACTIVE" },
      { expiresAt: now, status: "ACTIVE" },
      now
    )
  ).toBe(false);
});
test("only unexpired active subscriptions or current privileged users grant access", () => {
  expect(
    canAccessPost(
      post,
      { id: "member", role: "member", status: "ACTIVE" },
      { expiresAt: new Date(now.getTime() + 1000), status: "ACTIVE" },
      now
    )
  ).toBe(true);
  expect(
    canAccessPost(
      post,
      { id: "owner", role: "member", status: "ACTIVE" },
      null,
      now
    )
  ).toBe(true);
  expect(
    canAccessPost(
      post,
      { id: "admin", role: "admin", status: "SUSPENDED" },
      null,
      now
    )
  ).toBe(false);
});
test("hidden creator content is unavailable even to valid subscribers", () => {
  expect(
    canAccessPost(
      { ...post, creatorStatus: "SUSPENDED" },
      { id: "member", role: "member", status: "ACTIVE" },
      { expiresAt: new Date(now.getTime() + 1000), status: "ACTIVE" },
      now
    )
  ).toBe(false);
});
test("ownership rejects cross-user writes", () => {
  expect(() => requireOwner("other", "owner")).toThrow();
  expect(() => requireOwner("owner", "owner")).not.toThrow();
});
test("conversation participants reject guessed conversation identifiers", () => {
  expect(() =>
    requireParticipant("outsider", {
      participantAId: "alice",
      participantBId: "bob",
    })
  ).toThrow();
  expect(() =>
    requireParticipant("bob", {
      participantAId: "alice",
      participantBId: "bob",
    })
  ).not.toThrow();
});
