import { expect, test } from "bun:test";
import { QueryClient } from "@tanstack/react-query";
import { commitStudioPost } from "../../src/domains/studio/commit-studio-post";
import type { StudioCache } from "../../src/domains/studio/studio-cache-types";
import { post, studio } from "./studio-fixtures";

const content = {
  body: "Saved body",
  clientPostId: undefined,
  excerpt: "Saved preview",
  previewUrl: null,
  status: "DRAFT" as const,
  title: "Saved title",
  visibility: "SUBSCRIBERS" as const,
};

test("confirmed edit moves a post between status filters, preserves interactions and never patches public feed access", () => {
  const client = new QueryClient();
  client.setQueryData(["studio", { status: "ACTIVE" }], studio);
  client.setQueryData(["studio", { status: "PUBLISHED" }], studio);
  client.setQueryData(["studio", { status: "DRAFT" }], {
    ...studio,
    pages: studio.pages.map((page) => ({ ...page, posts: [] })),
  });
  client.setQueryData(["social-stream", "latest"], {
    pageParams: [undefined],
    pages: [{ items: [{ ...post, body: null, locked: true, mediaUrl: null }] }],
  });
  commitStudioPost(client, ["studio"], { content, id: post.id }, post);
  const active = client.getQueryData<StudioCache>([
    "studio",
    { status: "ACTIVE" },
  ]);
  expect(active?.pages[0]?.posts[0]).toMatchObject({
    commentCount: 3,
    likeCount: 4,
    mediaUrl: "/api/media/post-1",
    status: "DRAFT",
    title: "Saved title",
  });
  expect(active?.pages[0]?.metrics.posts).toBe(3);
  expect(
    client.getQueryData<StudioCache>(["studio", { status: "PUBLISHED" }])
      ?.pages[0]?.posts
  ).toEqual([]);
  expect(
    client.getQueryData<StudioCache>(["studio", { status: "DRAFT" }])?.pages[0]
      ?.posts[0]?.id
  ).toBe(post.id);
  expect(client.getQueryData(["social-stream", "latest"])).toMatchObject({
    pages: [{ items: [{ body: null, locked: true, mediaUrl: null }] }],
  });
});

test("confirming a retried creation does not count a post already found by a refetch twice", () => {
  const client = new QueryClient();
  client.setQueryData(["studio", { status: "ACTIVE" }], studio);
  client.setQueryData(["studio", { status: "DRAFT" }], {
    ...studio,
    pages: studio.pages.map((page) => ({ ...page, posts: [] })),
  });
  commitStudioPost(client, ["studio"], {
    content: { ...content, status: "PUBLISHED" },
    id: post.id,
  });
  expect(
    client.getQueryData<StudioCache>(["studio", { status: "ACTIVE" }])?.pages[0]
      ?.metrics.posts
  ).toBe(3);
  expect(
    client.getQueryData<StudioCache>(["studio", { status: "DRAFT" }])?.pages[0]
      ?.metrics.posts
  ).toBe(3);
  expect(
    client
      .getQueryData<StudioCache>(["studio", { status: "ACTIVE" }])
      ?.pages.flatMap((page) => page.posts)
      .filter((entry) => entry.id === post.id)
  ).toHaveLength(1);
});

test("confirmed new upload appears once in matching studio filters and uses only the private delivery route", () => {
  const client = new QueryClient();
  client.setQueryData(["studio", { status: "ACTIVE" }], studio);
  client.setQueryData(["studio", { status: "ARCHIVED" }], {
    ...studio,
    pages: studio.pages.map((page) => ({ ...page, posts: [] })),
  });
  commitStudioPost(client, ["studio"], {
    content: { ...content, status: "PUBLISHED" },
    id: "server-assigned",
    mediaType: "image/png",
  });
  const next = client.getQueryData<StudioCache>([
    "studio",
    { status: "ACTIVE" },
  ]);
  expect(
    next?.pages
      .flatMap((page) => page.posts)
      .filter((entry) => entry.id === "server-assigned")
  ).toHaveLength(1);
  expect(next?.pages[0]?.posts[0]?.mediaUrl).toBe("/api/media/server-assigned");
  expect(next?.pages.map((page) => page.metrics.posts)).toEqual([4, 4]);
  expect(
    client.getQueryData<StudioCache>(["studio", { status: "ARCHIVED" }])
      ?.pages[0]?.posts
  ).toEqual([]);
});
