import type { Database } from "../src/index";
import { assertDemoFixtureRelations } from "./assert-demo-fixture-relations";

type DemoRow = Record<string, unknown>;
interface Query {
  create?: DemoRow;
  data?: DemoRow;
  include?: DemoRow;
  update?: DemoRow;
  where?: DemoRow;
}
export function createDemoDatabaseFixture() {
  const tables = new Map<string, Map<string, DemoRow>>();
  let aborted = false;
  const models = [
    "user",
    "account",
    "creatorProfile",
    "post",
    "follow",
    "like",
    "bookmark",
    "comment",
    "membershipInterest",
    "conversation",
    "message",
    "notification",
    "report",
    "auditEvent",
  ];
  const db: Record<string, unknown> = {};
  for (const model of models) {
    const table = new Map<string, DemoRow>();
    tables.set(model, table);
    const matches = (row: DemoRow, where: DemoRow = {}) =>
      Object.entries(where).every(([key, value]) =>
        typeof value === "object" && value !== null
          ? Object.entries(value).every(
              ([field, entry]) => row[field] === entry
            )
          : row[key] === value
      );
    const find = (query: Query) =>
      [...table.values()].find((row) => matches(row, query.where)) ?? null;
    const create = (data: DemoRow) => {
      if (aborted) {
        throw new Error("Transaction rolled back");
      }
      const row = {
        createdAt: new Date(),
        image: null,
        updatedAt: new Date(),
        ...data,
        id: String(data.id ?? `fixture-${model}-${table.size}`),
      };
      if (table.has(row.id)) {
        throw new Error("Duplicate fixture identifier");
      }
      assertDemoFixtureRelations(tables, model, row);
      table.set(row.id, row);
      return row;
    };
    db[model] = {
      findFirst: find,
      findUnique: (query: Query) => {
        const row = find(query);
        if (model === "user" && row && query.include?.creatorProfile) {
          return {
            ...row,
            creatorProfile:
              [...(tables.get("creatorProfile")?.values() ?? [])].find(
                (profile) => profile.userId === row.id
              ) ?? null,
          };
        }
        return row;
      },
      updateMany: (query: Query) => {
        if (aborted) {
          throw new Error("Transaction rolled back");
        }
        const rows = [...table.values()].filter((row) =>
          matches(row, query.where)
        );
        for (const row of rows) {
          Object.assign(row, query.data);
        }
        return { count: rows.length };
      },
      upsert: (query: Query) => {
        if (aborted) {
          throw new Error("Transaction rolled back");
        }
        const existing = find(query);
        if (existing) {
          Object.assign(existing, query.update);
          return existing;
        }
        return create(query.create ?? {});
      },
    };
  }
  db.$transaction = async <T>(
    work: (tx: Database) => Promise<T>
  ): Promise<T> => {
    aborted = false;
    const snapshots = structuredClone(tables);
    try {
      return await work(db as unknown as Database);
    } catch (error) {
      aborted = true;
      for (const [name, table] of tables) {
        table.clear();
        for (const [id, row] of snapshots.get(name) ?? []) {
          table.set(id, row);
        }
      }
      throw error;
    }
  };
  return { db: db as unknown as Database, tables };
}
