import { expect, mock, test } from "bun:test";
import { call } from "@orpc/server";
import type { Database } from "@privana/db";
import type { Context } from "../src/context";
import { adminOverview } from "../src/domains/admin/overview";

const createdAt = new Date("2026-10-24T12:00:00Z");
const createFixture = (role = "admin", status = "ACTIVE") => {
  const users = Array.from({ length: 51 }, (_, index) => ({
    createdAt,
    email: `member${index}@example.com`,
    id: `member-${index}`,
    name: `Member ${index}`,
    role: "member",
    status: "ACTIVE",
  }));
  const creators = mock((_input: unknown) => []);
  const userRows = mock((_input: unknown) => users);
  const reports = mock((_input: unknown) => []);
  const audits = mock((_input: unknown) => []);
  const userCount = mock((_input?: unknown) => 150);
  const creatorCount = mock((input?: unknown) => (input ? 2 : 10));
  const reportCount = mock((_input?: unknown) => 3);
  const context: Context = {
    db: {
      auditEvent: { findMany: audits },
      creatorProfile: { count: creatorCount, findMany: creators },
      report: { count: reportCount, findMany: reports },
      user: {
        count: userCount,
        findMany: userRows,
        findUnique: () => ({ id: "owner", role, status }),
      },
    } as unknown as Database,
    session: { user: { id: "owner" } } as Context["session"],
  };
  return {
    audits,
    context,
    creatorCount,
    creators,
    reportCount,
    reports,
    userCount,
    userRows,
  };
};

test("admin overview accepts an omitted input and trims its sentinel row", async () => {
  const fixture = createFixture();
  const result = await call(adminOverview, undefined, {
    context: fixture.context,
  });
  expect(fixture.userRows).toHaveBeenCalledWith(
    expect.objectContaining({ skip: 0, take: 51 })
  );
  expect(result.users).toHaveLength(50);
  expect(result.users[0]?.createdAt).toBe(createdAt.toISOString());
  expect(result.pagination).toEqual({
    hasMore: true,
    hasMoreBySection: {
      audits: false,
      creators: false,
      reports: false,
      users: true,
    },
    page: 0,
  });
});

test("admin overview searches the database before pagination and keeps global totals", async () => {
  const fixture = createFixture();
  const result = await call(
    adminOverview,
    { page: 2, search: "  alice  " },
    { context: fixture.context }
  );
  const filter = { contains: "alice", mode: "insensitive" };
  expect(fixture.userRows).toHaveBeenCalledWith(
    expect.objectContaining({
      skip: 100,
      take: 51,
      where: { OR: [{ name: filter }, { email: filter }] },
    })
  );
  expect(fixture.creators).toHaveBeenCalledWith(
    expect.objectContaining({
      skip: 100,
      where: { OR: [{ displayName: filter }, { handle: filter }] },
    })
  );
  expect(fixture.reports).toHaveBeenCalledWith(
    expect.objectContaining({
      where: { OR: [{ reason: filter }, { id: filter }] },
    })
  );
  expect(fixture.audits).toHaveBeenCalledWith(
    expect.objectContaining({
      where: { OR: [{ action: filter }, { targetId: filter }] },
    })
  );
  expect(fixture.userCount).toHaveBeenCalledWith();
  expect(fixture.reportCount).toHaveBeenCalledWith({
    where: { status: "OPEN" },
  });
  expect(result.metrics).toEqual({
    creators: 10,
    openReports: 3,
    pendingCreators: 2,
    users: 150,
  });
  expect(result.pagination.page).toBe(2);
});

test.each([
  { page: -1 },
  { page: 0.5 },
  { page: 10_001 },
  { search: "x".repeat(201) },
])("admin overview rejects invalid pagination or search: %j", async (input) => {
  const fixture = createFixture();
  await expect(
    call(adminOverview, input, { context: fixture.context })
  ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  expect(fixture.userRows).not.toHaveBeenCalled();
});

test.each([
  ["member", "ACTIVE", "FORBIDDEN"],
  ["admin", "SUSPENDED", "UNAUTHORIZED"],
])(
  "admin overview denies %s/%s before loading counts",
  async (role, status, code) => {
    const fixture = createFixture(role, status);
    await expect(
      call(adminOverview, undefined, { context: fixture.context })
    ).rejects.toMatchObject({ code });
    expect(fixture.userCount).not.toHaveBeenCalled();
    expect(fixture.userRows).not.toHaveBeenCalled();
  }
);
