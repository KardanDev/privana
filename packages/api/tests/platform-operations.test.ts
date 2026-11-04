import { expect, test } from "bun:test";
import { call } from "@orpc/server";
import type { Database } from "@privana/db";
import type { Context } from "../src/context";
import { analyticsOverview } from "../src/domains/admin/analytics/overview";
import { operationsTransactions } from "../src/domains/admin/operations/transactions";
import { operationsUsers } from "../src/domains/admin/operations/users";
import { setTeamRole } from "../src/domains/admin/set-team-role";

test("user filters run before the page limit and totals describe the filtered result", async () => {
  const rows = Array.from({ length: 70 }, (_, index) => ({
    createdAt: new Date(),
    creatorProfile: null,
    email: `user${index}@example.test`,
    emailVerified: true,
    id: `user-${index}`,
    name: index < 40 ? "Other" : "Wanted",
    role: "member",
    status: index < 40 ? "ACTIVE" : "SUSPENDED",
  }));
  const filter = (where: {
    status?: string;
    role?: string;
    OR?: { name?: { contains: string } }[];
  }) =>
    rows.filter(
      (row) =>
        (!where.status || row.status === where.status) &&
        (!where.role || row.role === where.role) &&
        (!where.OR || row.name.includes(where.OR[0]?.name?.contains ?? ""))
    );
  const db = {
    user: {
      count: ({ where }: { where: Parameters<typeof filter>[0] }) =>
        filter(where).length,
      findMany: ({
        where,
        skip,
        take,
      }: {
        where: Parameters<typeof filter>[0];
        skip: number;
        take: number;
      }) => filter(where).slice(skip, skip + take),
      findUnique: () => ({ id: "mod", role: "moderator", status: "ACTIVE" }),
    },
  } as unknown as Database;
  const context: Context = {
    db,
    session: { user: { id: "mod" } } as unknown as Context["session"],
  };
  const first = await call(
    operationsUsers,
    { role: "member", search: "Wanted", status: "SUSPENDED" },
    { context }
  );
  expect(first.items).toHaveLength(25);
  expect(first.items[0]?.id).toBe("user-40");
  expect(first.total).toBe(30);
  expect(first.hasMore).toBe(true);
  const second = await call(
    operationsUsers,
    { page: 1, role: "member", search: "Wanted", status: "SUSPENDED" },
    { context }
  );
  expect(second.items).toHaveLength(5);
  expect(second.hasMore).toBe(false);
});

for (const target of [
  { emailVerified: false, role: "member", status: "ACTIVE" },
  { emailVerified: true, role: "member", status: "SUSPENDED" },
  { emailVerified: true, role: "admin", status: "ACTIVE" },
]) {
  test(`team role cannot be granted to ${JSON.stringify(target)}`, async () => {
    const db = {
      $transaction: async (work: (tx: Database) => Promise<unknown>) =>
        await work(db as unknown as Database),
      user: {
        findUnique: ({ where }: { where: { id: string } }) =>
          where.id === "admin"
            ? { id: "admin", role: "admin", status: "ACTIVE" }
            : { id: "target", ...target },
      },
    };
    const context: Context = {
      db: db as unknown as Database,
      session: { user: { id: "admin" } } as unknown as Context["session"],
    };
    await expect(
      call(setTeamRole, { id: "target", role: "editor" }, { context })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
}

test("analyst reads actual empty operations and UTC analytics without synthetic transactions", async () => {
  const db = {
    $queryRaw: () => [],
    creatorProfile: { count: () => 0 },
    post: { count: () => 0 },
    report: { count: () => 0 },
    subscription: { count: () => 0 },
    transactionRecord: {
      count: () => 0,
      findMany: () => [],
      groupBy: () => [],
    },
    user: {
      count: () => 0,
      findUnique: () => ({ id: "analyst", role: "analyst", status: "ACTIVE" }),
    },
  } as unknown as Database;
  const context: Context = {
    db,
    session: { user: { id: "analyst" } } as unknown as Context["session"],
  };
  const ledger = await call(
    operationsTransactions,
    { currency: "BRL", status: "SUCCEEDED" },
    { context }
  );
  expect(ledger).toEqual({ hasMore: false, items: [], page: 0, total: 0 });
  const analytics = await call(analyticsOverview, { days: 7 }, { context });
  expect(analytics.currencies).toEqual([]);
  expect(analytics.daily).toHaveLength(7);
  expect(analytics.daily.every((day) => day.transactions === 0)).toBe(true);
  expect(analytics.totals.users).toBe(0);
});
