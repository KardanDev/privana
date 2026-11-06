import { expect, test } from "bun:test";
import { call } from "@orpc/server";
import { savePost } from "../src/domains/studio/save-post";
import { postIdempotencyFixture } from "./post-idempotency-fixture";

const clientPostId = "60e87761-4624-4aee-bd6d-b56ea6c9c76b";
const input = {
  body: "Saved body",
  clientPostId,
  excerpt: "Public preview",
  status: "DRAFT" as const,
  title: "Title",
  visibility: "SUBSCRIBERS" as const,
};

test("concurrent create retries confirm one original post without any update", async () => {
  const fixture = postIdempotencyFixture();
  const results = await Promise.all(
    Array.from(
      { length: 20 },
      async () => await call(savePost, input, { context: fixture.context() })
    )
  );
  expect(results.every((row) => row.id === clientPostId)).toBe(true);
  expect(fixture.rows.size).toBe(1);
  expect(fixture.update).not.toHaveBeenCalled();
  expect(fixture.createMany).toHaveBeenCalledWith({
    data: [
      {
        body: input.body,
        creatorId: "creator-alice",
        excerpt: input.excerpt,
        id: clientPostId,
        status: "DRAFT",
        title: "Title",
        visibility: "SUBSCRIBERS",
      },
    ],
    skipDuplicates: true,
  });
});

test("equivalent trimmed content and normalized UUID return the original post ID", async () => {
  const fixture = postIdempotencyFixture();
  await call(savePost, input, { context: fixture.context() });
  const retried = await call(
    savePost,
    {
      ...input,
      body: " Saved body ",
      clientPostId: clientPostId.toUpperCase(),
      previewUrl: null,
    },
    { context: fixture.context() }
  );
  expect(retried).toEqual({ id: clientPostId });
  expect(fixture.rows.size).toBe(1);
  expect(fixture.update).not.toHaveBeenCalled();
});

test.each([
  { body: "Changed body" },
  { title: "Changed title" },
  { excerpt: "Changed preview" },
  { visibility: "PUBLIC" as const },
  { status: "PUBLISHED" as const },
  { previewUrl: "https://images.example.test/changed.png" },
])(
  "a changed retry payload conflicts without modifying the already-saved content: %j",
  async (change) => {
    const fixture = postIdempotencyFixture();
    await call(savePost, input, { context: fixture.context() });
    const original = fixture.rows.get(clientPostId);
    await expect(
      call(savePost, { ...input, ...change }, { context: fixture.context() })
    ).rejects.toMatchObject({ code: "CONFLICT" });
    expect(fixture.rows.get(clientPostId)).toEqual(original);
    expect(fixture.update).not.toHaveBeenCalled();
  }
);

test("reusing another creator's identifier does not overwrite or disclose that post", async () => {
  const fixture = postIdempotencyFixture();
  await call(savePost, input, { context: fixture.context() });
  await expect(
    call(savePost, input, { context: fixture.context("bob") })
  ).rejects.toMatchObject({ code: "CONFLICT" });
  expect(fixture.rows.get(clientPostId)?.creatorId).toBe("creator-alice");
  expect(fixture.update).not.toHaveBeenCalled();
});

test("media ownership and finalized MIME checks run before a retry can confirm a post", async () => {
  const fixture = postIdempotencyFixture();
  const media = {
    mediaKey: "alice/8bd645bc-6372-4db5-9d46-57fb2fbad974.png",
    mediaType: "image/png" as const,
  };
  await call(savePost, { ...input, ...media }, { context: fixture.context() });
  fixture.state.assetOwner = "bob";
  await expect(
    call(savePost, { ...input, ...media }, { context: fixture.context() })
  ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  fixture.state.assetOwner = "alice";
  fixture.state.assetType = "video/mp4";
  await expect(
    call(savePost, { ...input, ...media }, { context: fixture.context() })
  ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  expect(fixture.createMany).toHaveBeenCalledTimes(1);
});

test("adding media to an uncertain create retry conflicts rather than altering the original post", async () => {
  const fixture = postIdempotencyFixture();
  await call(savePost, input, { context: fixture.context() });
  await expect(
    call(
      savePost,
      {
        ...input,
        mediaKey: "alice/8bd645bc-6372-4db5-9d46-57fb2fbad974.png",
        mediaType: "image/png",
      },
      { context: fixture.context() }
    )
  ).rejects.toMatchObject({ code: "CONFLICT" });
  expect(fixture.rows.get(clientPostId)?.mediaKey).toBeNull();
});

test("known post IDs never bypass fresh creator approval or active account requirements", async () => {
  const fixture = postIdempotencyFixture();
  await call(savePost, input, { context: fixture.context() });
  fixture.state.creatorStatus = "PENDING";
  await expect(
    call(savePost, input, { context: fixture.context() })
  ).rejects.toMatchObject({ code: "FORBIDDEN" });
  fixture.state.creatorStatus = "ACTIVE";
  fixture.state.viewerStatus = "SUSPENDED";
  await expect(
    call(savePost, input, { context: fixture.context() })
  ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  expect(fixture.createMany).toHaveBeenCalledTimes(1);
});

test("legacy clients keep generated IDs and existing post edits omit the attempt ID", async () => {
  const fixture = postIdempotencyFixture();
  const { clientPostId: _ignored, ...legacy } = input;
  const first = await call(savePost, legacy, { context: fixture.context() });
  const second = await call(savePost, legacy, { context: fixture.context() });
  expect(first.id).not.toBe(second.id);
  await call(savePost, input, { context: fixture.context() });
  await call(
    savePost,
    { ...legacy, id: clientPostId, title: "Edited" },
    { context: fixture.context() }
  );
  expect(fixture.update).toHaveBeenCalledWith({
    data: { ...legacy, title: "Edited" },
    where: { id: clientPostId },
  });
});

test("an edit cannot also claim a creation attempt identifier", async () => {
  const fixture = postIdempotencyFixture();
  await expect(
    call(savePost, { ...input, id: "existing" }, { context: fixture.context() })
  ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  expect(fixture.createMany).not.toHaveBeenCalled();
  expect(fixture.update).not.toHaveBeenCalled();
});
