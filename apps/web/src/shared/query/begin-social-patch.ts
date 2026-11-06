import type { QueryClient } from "@tanstack/react-query";
import { applySocialPatch } from "./apply-social-patch";
import type { SocialPatch, SocialSnapshot } from "./social-patch";
import { isSocialQuery } from "./social-query";

export async function beginSocialPatch(
  client: QueryClient,
  patch: SocialPatch
): Promise<SocialSnapshot> {
  await client.cancelQueries({ predicate: isSocialQuery });
  const snapshots = client
    .getQueryCache()
    .findAll({ predicate: isSocialQuery })
    .map((query) => ({ data: query.state.data, key: query.queryKey }));
  client.setQueriesData({ predicate: isSocialQuery }, (current: unknown) =>
    applySocialPatch(current, patch)
  );
  return snapshots;
}
