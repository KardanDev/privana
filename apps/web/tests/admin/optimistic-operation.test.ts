import { expect, test } from "bun:test";
import { QueryClient } from "@tanstack/react-query";
import type { OperationsResult } from "../../src/domains/admin/operations-types";
import { optimisticOperation } from "../../src/domains/admin/optimistic-operation";
import { rollbackOperation } from "../../src/domains/admin/rollback-operation";

const result: OperationsResult = {
  data: {
    hasMore: false,
    items: [
      {
        createdAt: "2026-11-01T12:00:00Z",
        creatorId: null,
        email: "member@example.test",
        emailVerified: true,
        id: "member-a",
        name: "Camila",
        role: "member",
        status: "ACTIVE",
      },
      {
        createdAt: "2026-11-01T12:00:00Z",
        creatorId: null,
        email: "ana@example.test",
        emailVerified: true,
        id: "member-b",
        name: "Ana",
        role: "member",
        status: "ACTIVE",
      },
    ],
    page: 0,
    total: 2,
  },
  section: "users",
};

test("operation rollback restores its field without discarding another row or role update", async () => {
  const client = new QueryClient();
  const key = ["admin-operations", "users", { page: 0 }];
  client.setQueryData(key, result);
  client.setQueryData(["unrelated"], { retained: true });
  const undo = await optimisticOperation(client, {
    field: "status",
    id: "member-a",
    section: "users",
    value: "SUSPENDED",
  });
  await optimisticOperation(client, {
    field: "role",
    id: "member-a",
    section: "users",
    value: "editor",
  });
  await optimisticOperation(client, {
    field: "status",
    id: "member-b",
    section: "users",
    value: "SUSPENDED",
  });
  expect(
    client.getQueryData<OperationsResult>(key)?.data.items[0]
  ).toMatchObject({ role: "editor", status: "SUSPENDED" });
  rollbackOperation(client, undo);
  expect(client.getQueryData<OperationsResult>(key)?.data.items).toMatchObject([
    { id: "member-a", role: "editor", status: "ACTIVE" },
    { id: "member-b", status: "SUSPENDED" },
  ]);
  expect(client.getQueryData(["unrelated"])).toEqual({ retained: true });
  client.clear();
});

test("operation updates all cached filter variants without creating rows in missing pages", async () => {
  const client = new QueryClient();
  const full = ["admin-operations", "users", { page: 0 }];
  const filtered = ["admin-operations", "users", { search: "Camila" }];
  client.setQueryData(full, result);
  client.setQueryData(filtered, {
    ...result,
    data: { ...result.data, items: result.data.items.slice(0, 1), total: 1 },
  });
  await optimisticOperation(client, {
    field: "status",
    id: "member-a",
    section: "users",
    value: "SUSPENDED",
  });
  expect(
    client.getQueryData<OperationsResult>(full)?.data.items[0]
  ).toMatchObject({ status: "SUSPENDED" });
  expect(
    client.getQueryData<OperationsResult>(filtered)?.data.items[0]
  ).toMatchObject({ status: "SUSPENDED" });
  expect(
    await optimisticOperation(client, {
      field: "status",
      id: "absent",
      section: "users",
      value: "SUSPENDED",
    })
  ).toEqual([]);
  expect(client.getQueryData<OperationsResult>(filtered)?.data.total).toBe(1);
  client.clear();
});
