import type { CreatorDTO, PostDTO } from "@privana/api/contracts/product";

interface SocialTransforms {
  creator?: (creator: CreatorDTO) => CreatorDTO;
  post?: (post: PostDTO) => PostDTO;
}

// Only walk product collection slots. Metadata, cursors and unrelated caches stay intact.
const COLLECTIONS = ["pages", "items", "posts", "creator", "profile"] as const;

export function mapSocialData(
  data: unknown,
  transforms: SocialTransforms
): unknown {
  if (Array.isArray(data)) {
    let changed = false;
    const next = data.map((item: unknown) => {
      const value = mapSocialData(item, transforms);
      changed ||= value !== item;
      return value;
    });
    return changed ? next : data;
  }
  if (!data || typeof data !== "object") {
    return data;
  }
  let result: Record<string, unknown> = data as Record<string, unknown>;
  if (
    typeof result.id === "string" &&
    typeof result.likeCount === "number" &&
    typeof result.isLiked === "boolean" &&
    typeof result.isBookmarked === "boolean"
  ) {
    result = (transforms.post?.(result as unknown as PostDTO) ??
      result) as unknown as Record<string, unknown>;
  } else if (
    typeof result.id === "string" &&
    typeof result.followerCount === "number" &&
    typeof result.isFollowing === "boolean"
  ) {
    result = (transforms.creator?.(result as unknown as CreatorDTO) ??
      result) as unknown as Record<string, unknown>;
  }
  for (const slot of COLLECTIONS) {
    if (!(slot in result)) {
      continue;
    }
    const before = result[slot];
    const after = mapSocialData(before, transforms);
    if (after !== before) {
      result = { ...result, [slot]: after };
    }
  }
  return result;
}
