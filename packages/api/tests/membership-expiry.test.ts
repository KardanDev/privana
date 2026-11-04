import { expect, test } from "bun:test";
import { call } from "@orpc/server";
import type { Database } from "@privana/db";
import type { Context } from "../src/context";
import { effectiveSubscriptionStatus } from "../src/domains/memberships/effective-status";
import { listMemberships } from "../src/domains/memberships/list";

test("expiration takes effect at the access boundary without erasing canceled or revoked states", () => {
  const now = new Date("2026-11-04T12:00:00Z");
  const expiresAt = new Date(now);
  expect(
    effectiveSubscriptionStatus({ expiresAt, status: "ACTIVE" }, now)
  ).toBe("EXPIRED");
  expect(
    effectiveSubscriptionStatus(
      { expiresAt: new Date(now.getTime() + 1), status: "ACTIVE" },
      now
    )
  ).toBe("ACTIVE");
  expect(
    effectiveSubscriptionStatus({ expiresAt, status: "REVOKED" }, now)
  ).toBe("REVOKED");
  expect(
    effectiveSubscriptionStatus({ expiresAt, status: "CANCELED" }, now)
  ).toBe("CANCELED");
});

test("customer memberships no longer advertise access after an active record expires", async () => {
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
  const db = {
    follow: { findUnique: () => null },
    membershipInterest: { findMany: () => [] },
    subscription: {
      findMany: () => [
        {
          creator,
          creatorId: creator.id,
          expiresAt: new Date("2020-01-01T00:00:00Z"),
          id: "expired",
          status: "ACTIVE",
        },
      ],
    },
    user: {
      findUnique: () => ({ id: "member", role: "member", status: "ACTIVE" }),
    },
  } as unknown as Database;
  const context: Context = {
    db,
    session: { user: { id: "member" } } as Context["session"],
  };
  const rows = await call(listMemberships, undefined, { context });
  expect(rows).toHaveLength(1);
  expect(rows[0]?.status).toBe("EXPIRED");
  expect(rows[0]?.expiresAt).toBe("2020-01-01T00:00:00.000Z");
});
