import { ORPCError } from "@orpc/server";
import type { Database } from "@privana/db";
import type { z } from "zod";
import type { postInput } from "../shared/query-shapes";

type PostContent = Omit<z.infer<typeof postInput>, "id" | "clientPostId">;

export async function createStudioPost(
  db: Database,
  creatorId: string,
  content: PostContent,
  clientPostId?: string
): Promise<{ id: string }> {
  if (!clientPostId) {
    const post = await db.post.create({ data: { ...content, creatorId } });
    return { id: post.id };
  }
  // The unique ID makes an uncertain network retry safe across server instances.
  // A retry may confirm the original write, but may never overwrite that write.
  await db.post.createMany({
    data: [{ ...content, creatorId, id: clientPostId }],
    skipDuplicates: true,
  });
  const post = await db.post.findUnique({ where: { id: clientPostId } });
  const expected = {
    body: content.body,
    creatorId,
    excerpt: content.excerpt,
    mediaKey: content.mediaKey ?? null,
    mediaType: content.mediaType ?? null,
    previewUrl: content.previewUrl ?? null,
    status: content.status,
    title: content.title,
    visibility: content.visibility,
  };
  if (
    !post ||
    Object.entries(expected).some(
      ([field, value]) => Reflect.get(post, field) !== value
    )
  ) {
    throw new ORPCError("CONFLICT", {
      message:
        "Esta tentativa já foi salva com outros dados. Confira suas publicações e abra o conteúdo salvo para editar.",
    });
  }
  return { id: post.id };
}
