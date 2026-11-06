import { mock } from "bun:test";
import type { Database } from "@privana/db";
import type { Prisma } from "@privana/db/client";
import type { Context } from "../src/context";

interface StoredComment {
  body: string;
  createdAt: Date;
  id: string;
  postId: string;
  userId: string;
}

export function commentIdempotencyFixture() {
  const rows = new Map<string, StoredComment>();
  const state: {
    viewerStatus: string;
    creatorStatus: string;
    postStatus: string;
    visibility: string;
    subscribed: boolean;
  } = {
    creatorStatus: "ACTIVE",
    postStatus: "PUBLISHED",
    subscribed: false,
    viewerStatus: "ACTIVE",
    visibility: "PUBLIC",
  };
  const findUnique = mock(
    (input: { where: { id: string } }) => rows.get(input.where.id) ?? null
  );
  const createMany = mock(
    async (input: {
      data: Omit<StoredComment, "createdAt">[];
      skipDuplicates: boolean;
    }) => {
      const [data] = input.data;
      if (!data) {
        throw new Error("Missing fixture comment.");
      }
      if (rows.has(data.id)) {
        return { count: 0 };
      }
      rows.set(data.id, {
        ...data,
        createdAt: new Date("2026-11-06T12:00:00Z"),
      });
      await Promise.resolve();
      return { count: 1 };
    }
  );
  let sequence = 0;
  const create = mock(
    (input: { data: Omit<StoredComment, "id" | "createdAt"> }) => {
      sequence += 1;
      const row = {
        ...input.data,
        createdAt: new Date(),
        id: `generated-${sequence}`,
      };
      rows.set(row.id, row);
      return row;
    }
  );
  const tx = {
    comment: { create, createMany, findUnique },
  } as unknown as Prisma.TransactionClient;
  const transaction = mock(
    async <T>(callback: (client: Prisma.TransactionClient) => Promise<T>) =>
      await callback(tx)
  );
  const context = (viewerId = "member"): Context => ({
    db: {
      $transaction: transaction,
      post: {
        findUnique: (input: { where: { id: string } }) =>
          input.where.id === "missing"
            ? null
            : {
                creator: {
                  status: state.creatorStatus,
                  user: { status: "ACTIVE" },
                  userId: "creator-user",
                },
                creatorId: "creator-profile",
                id: input.where.id,
                mediaKey: null,
                mediaType: null,
                status: state.postStatus,
                visibility: state.visibility,
              },
      },
      subscription: {
        findUnique: () =>
          state.subscribed
            ? { expiresAt: new Date(Date.now() + 60_000), status: "ACTIVE" }
            : null,
      },
      user: {
        findUnique: () => ({
          id: viewerId,
          image: null,
          name: viewerId,
          role: "member",
          status: state.viewerStatus,
        }),
      },
    } as unknown as Database,
    session: { user: { id: viewerId } } as Context["session"],
  });
  return { context, create, createMany, findUnique, rows, state, transaction };
}
