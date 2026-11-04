import { expect, test } from "bun:test";
import { call } from "@orpc/server";
import type { Database } from "@privana/db";
import type { Context } from "../src/context";
import { canAccessPost } from "../src/domains/access/can-access-post";
import { analyticsOverview } from "../src/domains/admin/analytics/overview";
import { operationsTransactions } from "../src/domains/admin/operations/transactions";
import { revokeSubscription } from "../src/domains/admin/revoke-subscription";
import { setTeamRole } from "../src/domains/admin/set-team-role";
import { setUserStatus } from "../src/domains/admin/set-user-status";
import { createCmsFixture } from "./cms-fixture";

for (const role of ["member", "editor", "moderator"]) {
  test(`${role} cannot read financial records or analytics`, async () => {
    const { context } = createCmsFixture(role);
    await expect(
      call(operationsTransactions, undefined, { context })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(
      call(analyticsOverview, undefined, { context })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
}
for (const role of ["admin", "editor", "moderator", "analyst"]) {
  test(`moderator cannot suspend ${role} accounts`, async () => {
    const db = {
      $transaction: async (work: (tx: Database) => Promise<unknown>) =>
        await work(db as unknown as Database),
      user: {
        findUnique: ({ where }: { where: { id: string } }) =>
          where.id === "actor"
            ? { id: "actor", role: "moderator", status: "ACTIVE" }
            : { id: "target", role, status: "ACTIVE" },
      },
    };
    const context: Context = {
      db: db as unknown as Database,
      session: { user: { id: "actor" } } as unknown as Context["session"],
    };
    await expect(
      call(setUserStatus, { id: "target", status: "SUSPENDED" }, { context })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
}
test("superadmin cannot change their own team role", async () => {
  const { context } = createCmsFixture("admin");
  await expect(
    call(setTeamRole, { id: "team", role: "editor" }, { context })
  ).rejects.toMatchObject({ code: "FORBIDDEN" });
});
test("local revocation ends premium access and audits that processor billing was unchanged", async () => {
  const subscription = {
    expiresAt: new Date(Date.now() + 60_000),
    id: "subscription",
    status: "ACTIVE",
  };
  const audits: { metadata: { billingChanged: boolean; reason: string } }[] =
    [];
  const db = {
    $transaction: async (work: (tx: Database) => Promise<unknown>) =>
      await work(db as unknown as Database),
    auditEvent: {
      create: ({
        data,
      }: {
        data: { metadata: { billingChanged: boolean; reason: string } };
      }) => {
        audits.push(data);
        return data;
      },
    },
    subscription: {
      findUnique: () => subscription,
      update: () => {
        subscription.status = "REVOKED";
        return subscription;
      },
    },
    user: {
      findUnique: () => ({ id: "admin", role: "admin", status: "ACTIVE" }),
    },
  };
  const context: Context = {
    db: db as unknown as Database,
    session: { user: { id: "admin" } } as unknown as Context["session"],
  };
  await call(
    revokeSubscription,
    { id: "subscription", reason: "Solicitação de moderação válida." },
    { context }
  );
  expect(
    canAccessPost(
      {
        creatorStatus: "ACTIVE",
        creatorUserId: "owner",
        creatorUserStatus: "ACTIVE",
        status: "PUBLISHED",
        visibility: "SUBSCRIBERS",
      },
      { id: "member", role: "member", status: "ACTIVE" },
      subscription
    )
  ).toBe(false);
  expect(audits[0]?.metadata.billingChanged).toBe(false);
  expect(audits[0]?.metadata.reason).toContain("moderação");
});
