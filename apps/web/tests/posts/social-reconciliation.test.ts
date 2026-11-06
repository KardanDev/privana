import { expect, test } from "bun:test";
import { QueryClient } from "@tanstack/react-query";
import { beginSocialPatch } from "../../src/shared/query/begin-social-patch";
import { reconcileSocialQueries } from "../../src/shared/query/reconcile-social-queries";
import { SOCIAL_MUTATION_KEY } from "../../src/shared/query/social-patch";
import { post } from "./social-fixtures";

test("a completing write cannot refetch over another optimistic write; the last one reconciles only social queries", async () => {
  const client = new QueryClient();
  const key = ["social-stream", "latest"];
  client.setQueryData(key, { items: [post], nextCursor: null });
  client.setQueryData(["settings"], { name: "Test" });
  let finishFirst: () => void = () => undefined;
  let finishSecond: () => void = () => undefined;
  const first = client.getMutationCache().build(client, {
    mutationFn: () =>
      new Promise<void>((resolve) => {
        finishFirst = resolve;
      }),
    mutationKey: [...SOCIAL_MUTATION_KEY, "like", post.id],
  });
  const second = client.getMutationCache().build(client, {
    mutationFn: () =>
      new Promise<void>((resolve) => {
        finishSecond = resolve;
      }),
    mutationKey: [...SOCIAL_MUTATION_KEY, "bookmark", post.id],
  });
  const firstTask = first.execute(undefined);
  const secondTask = second.execute(undefined);
  // Mutation functions start after onMutate's microtask, as in the real hooks.
  await Promise.resolve();
  await Promise.resolve();
  expect(client.isMutating({ mutationKey: SOCIAL_MUTATION_KEY })).toBe(2);
  await reconcileSocialQueries(client);
  expect(client.getQueryState(key)?.isInvalidated).toBe(false);
  finishFirst();
  await firstTask;
  await reconcileSocialQueries(client);
  expect(client.getQueryState(key)?.isInvalidated).toBe(true);
  expect(client.getQueryState(["settings"])?.isInvalidated).toBe(false);
  finishSecond();
  await secondTask;
  client.clear();
});

test("cancelling a stale feed request before patching stops it replacing optimistic state", async () => {
  const client = new QueryClient();
  const key = ["social-stream", "latest"];
  client.setQueryData(key, { items: [post], nextCursor: null });
  let aborted = false;
  const fetch = client
    .fetchQuery({
      queryFn: ({ signal }) =>
        new Promise((_resolve, reject) => {
          signal.addEventListener("abort", () => {
            aborted = true;
            reject(new Error("cancelled"));
          });
        }),
      queryKey: key,
      staleTime: 0,
    })
    .catch(() => undefined);
  await beginSocialPatch(client, {
    kind: "like",
    liked: true,
    postId: post.id,
  });
  await fetch;
  expect(aborted).toBe(true);
  expect(client.getQueryData(key)).toMatchObject({
    items: [{ isLiked: true, likeCount: 5 }],
  });
  client.clear();
});
