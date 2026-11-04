import { expect, test } from "bun:test";
import { call } from "@orpc/server";
import type { Database } from "@privana/db";
import type { Prisma } from "@privana/db/client";
import type { Context } from "../src/context";
import { setCreatorStatus } from "../src/domains/admin/set-creator-status";
import { setTeamRole } from "../src/domains/admin/set-team-role";
import { setUserStatus } from "../src/domains/admin/set-user-status";
import { createAdminConcurrencyFixture } from "./admin-concurrency-fixture";

test("a concurrent team promotion prevents moderator suspension and its side effects", async () => {
  const fixture = createAdminConcurrencyFixture();
  fixture.onTargetRead(() => {
    fixture.target.role = "editor";
  });
  await expect(
    call(setUserStatus, { id: "target", status: "SUSPENDED" }, fixture)
  ).rejects.toMatchObject({ code: "CONFLICT" });
  expect(fixture.target.status).toBe("ACTIVE");
  expect(fixture.target.role).toBe("editor");
  expect(fixture.mutations).toEqual({ audit: 0, sessions: 0, writes: 0 });
});

test.each(["role", "status", "emailVerified"] as const)(
  "a concurrent change to %s prevents stale team grants",
  async (field) => {
    const fixture = createAdminConcurrencyFixture("admin");
    fixture.onTargetRead(() => {
      if (field === "role") {
        fixture.target.role = "admin";
      } else if (field === "status") {
        fixture.target.status = "SUSPENDED";
      } else {
        fixture.target.emailVerified = false;
      }
    });
    await expect(
      call(setTeamRole, { id: "target", role: "editor" }, fixture)
    ).rejects.toMatchObject({ code: "CONFLICT" });
    expect(fixture.target.role).not.toBe("editor");
    expect(fixture.mutations).toEqual({ audit: 0, sessions: 0, writes: 0 });
  }
);

test("unchanged eligible targets still receive audited status and team updates", async () => {
  const moderation = createAdminConcurrencyFixture();
  await call(setUserStatus, { id: "target", status: "SUSPENDED" }, moderation);
  expect(moderation.target.status).toBe("SUSPENDED");
  expect(moderation.mutations).toEqual({ audit: 1, sessions: 1, writes: 1 });
  const team = createAdminConcurrencyFixture("admin");
  await call(setTeamRole, { id: "target", role: "editor" }, team);
  expect(team.target.role).toBe("editor");
  expect(team.mutations).toEqual({ audit: 1, sessions: 1, writes: 1 });
});

test("creator moderation checks the owner role returned while holding both row locks", async () => {
  let writes = 0;
  let locks = 0;
  const db = {
    $queryRaw: (query: Prisma.Sql) => {
      expect(query.text).toContain("FOR UPDATE OF creator, owner");
      expect(query.values).toEqual(["profile"]);
      locks += 1;
      return [
        {
          id: "profile",
          status: "ACTIVE",
          userId: "target",
          userRole: "editor",
        },
      ];
    },
    $transaction: async (work: (tx: Database) => Promise<unknown>) =>
      await work(db as unknown as Database),
    auditEvent: { create: () => undefined },
    creatorProfile: {
      findUnique: () => ({
        id: "profile",
        status: "ACTIVE",
        user: { role: "member" },
        userId: "target",
      }),
      update: () => {
        writes += 1;
      },
    },
    user: {
      findUnique: () => ({ id: "actor", role: "moderator", status: "ACTIVE" }),
    },
  };
  const context: Context = {
    db: db as unknown as Database,
    session: { user: { id: "actor" } } as unknown as Context["session"],
  };
  await expect(
    call(setCreatorStatus, { id: "profile", status: "SUSPENDED" }, { context })
  ).rejects.toMatchObject({ code: "FORBIDDEN" });
  expect(locks).toBe(1);
  expect(writes).toBe(0);
});
