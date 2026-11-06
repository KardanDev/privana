import { mock } from "bun:test";
import type { Database } from "@privana/db";
import type { Prisma } from "@privana/db/client";
import type { Context } from "../src/context";

interface StoredPost {
  body: string;
  creatorId: string;
  excerpt: string;
  id: string;
  mediaKey: string | null;
  mediaType: string | null;
  previewUrl: string | null;
  status: string;
  title: string;
  visibility: string;
}

export function postIdempotencyFixture() {
  const rows = new Map<string, StoredPost>();
  const state: {
    assetOwner: string;
    assetType: string;
    creatorStatus: string;
    viewerStatus: string;
  } = {
    assetOwner: "alice",
    assetType: "image/png",
    creatorStatus: "ACTIVE",
    viewerStatus: "ACTIVE",
  };
  let generated = 0;
  const createMany = mock(
    async (input: {
      data: Prisma.PostCreateManyInput[];
      skipDuplicates: boolean;
    }) => {
      const [entry] = input.data;
      if (!entry?.id) {
        throw new Error("Missing fixture post ID.");
      }
      if (rows.has(entry.id)) {
        return { count: 0 };
      }
      rows.set(entry.id, {
        body: entry.body,
        creatorId: entry.creatorId,
        excerpt: entry.excerpt ?? "",
        id: entry.id,
        mediaKey: entry.mediaKey ?? null,
        mediaType: entry.mediaType ?? null,
        previewUrl: entry.previewUrl ?? null,
        status: entry.status ?? "DRAFT",
        title: entry.title,
        visibility: entry.visibility ?? "PUBLIC",
      });
      await Promise.resolve();
      return { count: 1 };
    }
  );
  const create = mock((input: { data: object }) => {
    generated += 1;
    return { ...input.data, id: `generated-${generated}` };
  });
  const findUnique = mock(
    (input: { include?: object; where: { id: string } }) => {
      const post = rows.get(input.where.id);
      return post
        ? {
            ...post,
            creator: { userId: post.creatorId.replace("creator-", "") },
          }
        : null;
    }
  );
  const update = mock(() => ({}));
  const media = mock(() => ({
    mimeType: state.assetType,
    userId: state.assetOwner,
  }));
  const context = (viewerId = "alice"): Context => ({
    db: {
      creatorProfile: {
        findUnique: () => ({
          id: `creator-${viewerId}`,
          status: state.creatorStatus,
          userId: viewerId,
        }),
      },
      mediaAsset: { findUnique: media },
      post: { create, createMany, findUnique, update },
      user: {
        findUnique: () => ({
          id: viewerId,
          role: "creator",
          status: state.viewerStatus,
        }),
      },
    } as unknown as Database,
    session: { user: { id: viewerId } } as Context["session"],
  });
  return {
    context,
    create,
    createMany,
    findUnique,
    media,
    rows,
    state,
    update,
  };
}
