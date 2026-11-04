import { expect, test } from "bun:test";
import { call } from "@orpc/server";
import type { Database } from "@privana/db";
import type { Context } from "../src/context";
import { setCreatorStatus } from "../src/domains/admin/set-creator-status";

test.each([
  { from: "member", to: "creator" },
  { from: "creator", to: "creator" },
  { from: "editor", to: "editor" },
  { from: "moderator", to: "moderator" },
  { from: "analyst", to: "analyst" },
  { from: "admin", to: "admin" },
])(
  "approving a profile changes role $from to $to without removing team access",
  async ({ from, to }) => {
    const target = { role: from, status: "PENDING" };
    const events: unknown[] = [];
    const db = {
      $queryRaw: () => [
        {
          id: "profile",
          status: target.status,
          userId: "target",
          userRole: target.role,
        },
      ],
      $transaction: async (work: (tx: Database) => Promise<unknown>) =>
        await work(db as unknown as Database),
      auditEvent: {
        create: ({ data }: { data: unknown }) => {
          events.push(data);
        },
      },
      creatorProfile: {
        update: ({ data }: { data: { status: string } }) => {
          target.status = data.status;
          return { id: "profile" };
        },
      },
      user: {
        findUnique: () => ({ id: "operator", role: "admin", status: "ACTIVE" }),
        updateMany: ({
          data,
          where,
        }: {
          data: { role: string };
          where: { id: string; role: string };
        }) => {
          if (where.id !== "target" || where.role !== target.role) {
            return { count: 0 };
          }
          target.role = data.role;
          return { count: 1 };
        },
      },
    };
    const context: Context = {
      db: db as unknown as Database,
      session: { user: { id: "operator" } } as Context["session"],
    };
    await call(
      setCreatorStatus,
      { id: "profile", status: "ACTIVE" },
      { context }
    );
    expect(target).toEqual({ role: to, status: "ACTIVE" });
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      metadata: {
        from: "PENDING",
        to: "ACTIVE",
        userRoleFrom: from,
        userRoleTo: to,
      },
    });
  }
);
