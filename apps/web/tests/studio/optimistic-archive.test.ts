import { expect, test } from "bun:test";
import { QueryClient } from "@tanstack/react-query";
import { archiveStudioCache } from "../../src/domains/studio/archive-studio-cache";
import { rollbackStudioArchive } from "../../src/domains/studio/rollback-studio-archive";
import type { StudioCache } from "../../src/domains/studio/studio-cache-types";
import { post, studio } from "./studio-fixtures";

const key = ["studio", { status: "ACTIVE" }];

test("archive hides only the selected post across pages and adjusts each global metric", () => {
  const client = new QueryClient();
  client.setQueryData(key, studio);
  client.setQueryData(["unrelated"], { title: "Untouched" });
  const snapshots = archiveStudioCache(client, ["studio"], post);
  const next = client.getQueryData<StudioCache>(key);
  expect(
    next?.pages.flatMap((page) => page.posts).map((entry) => entry.id)
  ).toEqual(["post-2"]);
  expect(next?.pages.map((page) => page.metrics.posts)).toEqual([2, 2]);
  expect(next?.pageParams).toEqual(studio.pageParams);
  expect(client.getQueryData(["unrelated"])).toEqual({ title: "Untouched" });
  rollbackStudioArchive(client, snapshots, post);
  expect(client.getQueryData(key)).toEqual(studio);
});

test("a failed archive restores its own row and count without undoing another pending archive or refreshed follower data", () => {
  const client = new QueryClient();
  client.setQueryData(key, studio);
  const snapshots = archiveStudioCache(client, ["studio"], post);
  archiveStudioCache(client, ["studio"], { ...post, id: "post-2" });
  client.setQueryData<StudioCache>(key, (current) =>
    current
      ? {
          ...current,
          pages: current.pages.map((page) => ({
            ...page,
            metrics: { ...page.metrics, followers: 5 },
          })),
        }
      : current
  );
  rollbackStudioArchive(client, snapshots, post);
  const next = client.getQueryData<StudioCache>(key);
  expect(
    next?.pages.flatMap((page) => page.posts).map((entry) => entry.id)
  ).toEqual(["post-1"]);
  expect(next?.pages.map((page) => page.metrics.posts)).toEqual([2, 2]);
  expect(next?.pages.map((page) => page.metrics.followers)).toEqual([5, 5]);
});

test("archiving an already archived post makes no optimistic count change", () => {
  const client = new QueryClient();
  client.setQueryData(key, studio);
  expect(
    archiveStudioCache(client, ["studio"], { ...post, status: "ARCHIVED" })
  ).toEqual([]);
  expect(client.getQueryData(key)).toEqual(studio);
});
