import type { QueryClient } from "@tanstack/react-query";
import { SOCIAL_MUTATION_KEY } from "./social-patch";
import { isSocialQuery } from "./social-query";

export async function reconcileSocialQueries(
  client: QueryClient
): Promise<void> {
  // Other social writes may still be optimistic. Refetch only after the last one settles.
  if (client.isMutating({ mutationKey: SOCIAL_MUTATION_KEY }) <= 1) {
    await client.invalidateQueries({ predicate: isSocialQuery });
  }
}
