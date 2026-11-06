import { mock } from "bun:test";
import type { Database } from "@privana/db";
import type { Prisma } from "@privana/db/client";
import type { Context } from "../src/context";
import { defaultPlatformConfig } from "../src/contracts/platform";

interface StoredMessage {
  body: string;
  conversationId: string;
  createdAt: Date;
  id: string;
  senderId: string;
}

export function messageIdempotencyFixture() {
  const rows = new Map<string, StoredMessage>();
  const state = { messaging: true, recipientActive: true, senderActive: true };
  let generated = 0;
  const findUnique = mock(
    (input: { where: { id: string } }) => rows.get(input.where.id) ?? null
  );
  const createMany = mock(
    async (input: {
      data: Omit<StoredMessage, "createdAt">[];
      skipDuplicates: boolean;
    }) => {
      const [row] = input.data;
      if (!row) {
        throw new Error("Missing fixture message.");
      }
      // The mock models PostgreSQL INSERT ... ON CONFLICT DO NOTHING: a unique
      // check and insert are one operation even when many callers await together.
      if (rows.has(row.id)) {
        return { count: 0 };
      }
      rows.set(row.id, {
        ...row,
        createdAt: new Date("2026-11-06T12:00:00.000Z"),
      });
      await Promise.resolve();
      return { count: 1 };
    }
  );
  const create = mock(
    (input: { data: Omit<StoredMessage, "createdAt" | "id"> }) => {
      generated += 1;
      const message = {
        ...input.data,
        createdAt: new Date(),
        id: `generated-${generated}`,
      };
      rows.set(message.id, message);
      return message;
    }
  );
  const updateConversation = mock(() => ({}));
  const notify = mock(() => ({}));
  const conversation = mock((input: { where: { id: string } }) =>
    input.where.id === "missing"
      ? null
      : {
          id: input.where.id,
          // biome-ignore lint/suspicious/noUnnecessaryConditions: Tests toggle this mutable fixture state between calls.
          participantA: { status: state.senderActive ? "ACTIVE" : "SUSPENDED" },
          participantAId: "alice",
          participantB: {
            // biome-ignore lint/suspicious/noUnnecessaryConditions: Tests toggle this mutable fixture state between calls.
            status: state.recipientActive ? "ACTIVE" : "SUSPENDED",
          },
          participantBId: "bob",
        }
  );
  const tx = {
    conversation: { findUnique: conversation, update: updateConversation },
    message: { create, createMany, findUnique },
    notification: { create: notify },
  } as unknown as Prisma.TransactionClient;
  const transaction = mock(
    async <T>(callback: (client: Prisma.TransactionClient) => Promise<T>) =>
      await callback(tx)
  );
  const context = (viewerId = "alice"): Context => ({
    db: {
      $transaction: transaction,
      platformSettings: {
        findUnique: () => ({
          published: {
            ...defaultPlatformConfig,
            features: {
              ...defaultPlatformConfig.features,
              messaging: state.messaging,
            },
          },
        }),
      },
      user: {
        findUnique: () => ({
          id: viewerId,
          name: viewerId,
          role: "member",
          status:
            viewerId === "alice" && !state.senderActive
              ? "SUSPENDED"
              : "ACTIVE",
        }),
      },
    } as unknown as Database,
    session: { user: { id: viewerId } } as Context["session"],
  });
  return {
    context,
    conversation,
    create,
    createMany,
    findUnique,
    notify,
    rows,
    state,
    transaction,
    updateConversation,
  };
}
