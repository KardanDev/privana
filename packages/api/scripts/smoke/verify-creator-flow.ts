import assert from "node:assert/strict";
import type { AppRouterClient } from "../../src/routers/index";
import { expectDenied } from "./expect-denied";

export async function verifyCreatorFlow(
  creator: AppRouterClient,
  member: AppRouterClient,
  pending: AppRouterClient
) {
  const data = {
    body: "DEMONSTRAÇÃO · Publicação criada pela verificação de integração HTTP.",
    excerpt: "Teste de criação, edição, publicação e arquivamento.",
    title: "DEMONSTRAÇÃO · Teste do estúdio",
    visibility: "PUBLIC" as const,
  };
  await expectDenied(pending.studio.savePost({ ...data, status: "PUBLISHED" }));
  const draft = await creator.studio.savePost({ ...data, status: "DRAFT" });
  try {
    await expectDenied(
      member.studio.savePost({ ...data, id: draft.id, status: "PUBLISHED" })
    );
    await creator.studio.savePost({
      ...data,
      id: draft.id,
      status: "PUBLISHED",
    });
    const recent = await member.feed.list({ limit: 24 });
    assert.equal(
      recent.items[0]?.id,
      draft.id,
      "Recent feed must sort by publication creation time, including demo fixtures"
    );
    const comment = await member.posts.addComment({
      body: "DEMONSTRAÇÃO · Comentário de verificação.",
      postId: draft.id,
    });
    const comments = await creator.posts.comments({ postId: draft.id });
    assert.ok(comments.items.some((item) => item.id === comment.id));
  } finally {
    await creator.studio.deletePost({ id: draft.id });
  }
  const afterArchive = await member.feed.list({ limit: 24 });
  assert.ok(afterArchive.items.every((item) => item.id !== draft.id));
  const archived = await creator.studio.overview({ status: "ARCHIVED" });
  assert.ok(archived.posts.some((item) => item.id === draft.id));
  assert.ok(archived.posts.every((item) => item.status === "ARCHIVED"));
  const drafts = await creator.studio.overview({ status: "DRAFT" });
  assert.ok(drafts.posts.every((item) => item.status === "DRAFT"));
}
