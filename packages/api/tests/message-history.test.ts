import { expect, mock, test } from "bun:test";
import { call } from "@orpc/server";
import type { Database } from "@privana/db";
import type { Context } from "../src/context";
import { getMessages } from "../src/domains/messages/get";

type Boundary =
  | { createdAt: { lt: Date } }
  | { createdAt: Date; id: { lt: string } };
interface MessageQuery {
  take: number;
  where: { conversationId: string; OR?: Boundary[] };
}

const createHistoryFixture = (viewerId = "alice") => {
  const rows = Array.from({ length: 120 }, (_, index) => ({
    body: `Message ${index + 1}`,
    conversationId: "shared",
    createdAt: new Date(
      index < 20 ? "2026-10-24T12:00:00Z" : "2026-10-24T12:01:00Z"
    ),
    id: `message-${String(index + 1).padStart(3, "0")}`,
    senderId: "alice",
  }));
  const findMany = mock((input: MessageQuery) =>
    rows
      .filter((row) => {
        if (row.conversationId !== input.where.conversationId) {
          return false;
        }
        if (!input.where.OR) {
          return true;
        }
        return input.where.OR.some((boundary) =>
          "id" in boundary
            ? row.createdAt.getTime() === boundary.createdAt.getTime() &&
              row.id < boundary.id.lt
            : row.createdAt < boundary.createdAt.lt
        );
      })
      .toSorted(
        (a, b) =>
          b.createdAt.getTime() - a.createdAt.getTime() ||
          b.id.localeCompare(a.id)
      )
      .slice(0, input.take)
  );
  const findFirst = mock(
    (input: { where: { id: string; conversationId: string } }) =>
      rows.find(
        (row) =>
          row.id === input.where.id &&
          row.conversationId === input.where.conversationId
      ) ?? null
  );
  const context: Context = {
    db: {
      conversation: {
        findUnique: () => ({
          id: "shared",
          participantAId: "alice",
          participantBId: "bob",
        }),
      },
      message: { findFirst, findMany },
      user: {
        findUnique: () => ({ id: viewerId, role: "member", status: "ACTIVE" }),
      },
    } as unknown as Database,
    session: { user: { id: viewerId } } as Context["session"],
  };
  return { context, findFirst, findMany };
};

test("older message pages reach all stored history without duplicating tied timestamps", async () => {
  const { context, findMany } = createHistoryFixture();
  const latest = await call(
    getMessages,
    { conversationId: "shared" },
    { context }
  );
  const older = await call(
    getMessages,
    { before: latest[0]?.id, conversationId: "shared" },
    { context }
  );
  const oldest = await call(
    getMessages,
    { before: older[0]?.id, conversationId: "shared" },
    { context }
  );
  expect(latest).toHaveLength(50);
  expect(older).toHaveLength(50);
  expect(oldest).toHaveLength(20);
  const ids = [...oldest, ...older, ...latest].map((row) => row.id);
  expect(new Set(ids).size).toBe(120);
  expect(ids).toEqual(
    Array.from(
      { length: 120 },
      (_, index) => `message-${String(index + 1).padStart(3, "0")}`
    )
  );
  expect(findMany).toHaveBeenLastCalledWith(
    expect.objectContaining({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 50,
    })
  );
});

test("nonparticipants cannot request older pages or look up their cursor", async () => {
  const { context, findFirst, findMany } = createHistoryFixture("outsider");
  await expect(
    call(
      getMessages,
      { before: "message-071", conversationId: "shared" },
      { context }
    )
  ).rejects.toMatchObject({ code: "FORBIDDEN" });
  expect(findFirst).not.toHaveBeenCalled();
  expect(findMany).not.toHaveBeenCalled();
});

test("a cursor outside the authorized conversation is rejected before reading history", async () => {
  const { context, findFirst, findMany } = createHistoryFixture();
  await expect(
    call(
      getMessages,
      { before: "other-conversation-message", conversationId: "shared" },
      { context }
    )
  ).rejects.toMatchObject({ code: "NOT_FOUND" });
  expect(findFirst).toHaveBeenCalledWith(
    expect.objectContaining({
      where: { conversationId: "shared", id: "other-conversation-message" },
    })
  );
  expect(findMany).not.toHaveBeenCalled();
});
