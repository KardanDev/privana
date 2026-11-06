import type { QueryKey } from "@tanstack/react-query";

export type SocialPatch =
  | { kind: "like"; postId: string; liked: boolean }
  | { kind: "bookmark"; postId: string; bookmarked: boolean }
  | { kind: "follow"; creatorId: string; following: boolean }
  | { kind: "comment"; postId: string; delta: number };

export type SocialSnapshot = Array<{ key: QueryKey; data: unknown }>;
export type SocialTogglePatch = Exclude<SocialPatch, { kind: "comment" }>;
export const SOCIAL_MUTATION_KEY = ["social-write"] as const;
