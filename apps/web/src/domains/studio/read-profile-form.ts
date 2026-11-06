export function readProfileForm(data: FormData) {
  return {
    avatarUrl: String(data.get("avatarUrl") || "") || null,
    bio: String(data.get("bio") ?? "").trim(),
    category: String(data.get("category") ?? "").trim(),
    coverUrl: String(data.get("coverUrl") || "") || null,
    displayName: String(data.get("displayName") ?? "").trim(),
    handle: String(data.get("handle") ?? "")
      .trim()
      .toLowerCase(),
    location: String(data.get("location") ?? "").trim(),
    monthlyPriceCents: Math.round(
      Number(String(data.get("price") ?? "").replace(",", ".")) * 100
    ),
  };
}
