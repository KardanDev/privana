import type { CreatorDTO } from "@privana/api/contracts/product";
import type { QueryClient } from "@tanstack/react-query";
import { mapSocialData } from "@/shared/query/map-social-data";
import { isSocialQuery } from "@/shared/query/social-query";

export function findCachedCreator(
  client: QueryClient,
  creatorId: string
): CreatorDTO | undefined {
  let found: CreatorDTO | undefined;
  for (const query of client
    .getQueryCache()
    .findAll({ predicate: isSocialQuery })) {
    mapSocialData(query.state.data, {
      creator: (creator) => {
        if (creator.id === creatorId) {
          found = creator;
        }
        return creator;
      },
    });
    if (found) {
      return found;
    }
  }
  return undefined;
}
