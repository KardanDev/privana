import type { CreatorDTO } from "@privana/api/contracts/product";

export function profileFields(profile: CreatorDTO) {
  return {
    avatarUrl: profile.avatarUrl,
    bio: profile.bio,
    category: profile.category,
    coverUrl: profile.coverUrl,
    displayName: profile.displayName,
    handle: profile.handle,
    location: profile.location,
    monthlyPriceCents: profile.monthlyPriceCents,
  };
}
