export function readPostForm(
  data: FormData,
  status: "DRAFT" | "PUBLISHED",
  id?: string,
  clientPostId?: string
) {
  return {
    body: String(data.get("body") ?? "").trim(),
    clientPostId: id ? undefined : clientPostId,
    excerpt: String(data.get("excerpt") ?? "").trim(),
    id,
    previewUrl: String(data.get("previewUrl") || "") || null,
    status,
    title: String(data.get("title") ?? "").trim(),
    visibility:
      data.get("visibility") === "SUBSCRIBERS"
        ? ("SUBSCRIBERS" as const)
        : ("PUBLIC" as const),
  };
}
