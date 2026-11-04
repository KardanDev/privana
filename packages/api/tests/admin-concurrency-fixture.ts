import { mock } from "bun:test";
import type { Database } from "@privana/db";
import type { Context } from "../src/context";

export function createAdminConcurrencyFixture(actorRole = "moderator") {
  const target = {
    emailVerified: true,
    id: "target",
    role: "member",
    status: "ACTIVE",
  };
  const mutations = { audit: 0, sessions: 0, writes: 0 };
  let afterRead: () => void = () => undefined;
  const targetRows = mock(({ where }: { where: { id: string } }) => {
    if (where.id === "actor") {
      return { id: "actor", role: actorRole, status: "ACTIVE" };
    }
    const snapshot = { ...target };
    afterRead();
    return snapshot;
  });
  const db = {
    $transaction: async (work: (tx: Database) => Promise<unknown>) =>
      await work(db as unknown as Database),
    auditEvent: {
      create: () => {
        mutations.audit += 1;
      },
    },
    session: {
      deleteMany: () => {
        mutations.sessions += 1;
      },
    },
    user: {
      findUnique: targetRows,
      update: ({ data }: { data: Partial<typeof target> }) => {
        Object.assign(target, data);
        mutations.writes += 1;
        return target;
      },
      updateMany: ({
        data,
        where,
      }: {
        data: Partial<typeof target>;
        where: Partial<typeof target>;
      }) => {
        if (
          Object.entries(where).some(
            ([key, value]) => target[key as keyof typeof target] !== value
          )
        ) {
          return { count: 0 };
        }
        Object.assign(target, data);
        mutations.writes += 1;
        return { count: 1 };
      },
    },
  };
  const context: Context = {
    db: db as unknown as Database,
    session: { user: { id: "actor" } } as unknown as Context["session"],
  };
  return {
    context,
    mutations,
    onTargetRead: (callback: () => void) => {
      afterRead = callback;
    },
    target,
  };
}
