import type { CreatorDTO } from "@privana/api/contracts/product";
import type { QueryClient, QueryKey } from "@tanstack/react-query";
import type { profileFields } from "./profile-fields";
import type { StudioCache } from "./studio-cache-types";

export function updateStudioProfileCache(
  queryClient: QueryClient,
  studioKey: QueryKey,
  profileId: string,
  fields: ReturnType<typeof profileFields>
): void {
  queryClient.setQueriesData<StudioCache>({ queryKey: studioKey }, (current) =>
    current
      ? {
          ...current,
          pages: current.pages.map((page) => ({
            ...page,
            profile:
              page.profile?.id === profileId
                ? { ...page.profile, ...fields }
                : page.profile,
          })),
        }
      : current
  );
  queryClient.setQueriesData<CreatorDTO>(
    { queryKey: ["creator"] },
    (current) =>
      current?.id === profileId ? { ...current, ...fields } : current
  );
}
