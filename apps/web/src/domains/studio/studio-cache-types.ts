import type { CreatorDTO, PostDTO } from "@privana/api/contracts/product";
import type { InfiniteData, QueryKey } from "@tanstack/react-query";

export interface StudioOverview {
  metrics: {
    activeSubscriptions: number;
    followers: number;
    interests: number;
    posts: number;
  };
  nextCursor: string | null;
  posts: PostDTO[];
  profile: CreatorDTO | null;
}
export type StudioCache = InfiniteData<StudioOverview, string | undefined>;
export interface StudioCacheSnapshot {
  data: StudioCache;
  key: QueryKey;
}
export const STUDIO_WRITE_KEY = ["studio-write"] as const;
