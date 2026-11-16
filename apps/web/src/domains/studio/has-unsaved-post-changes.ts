import type { PostDTO } from "@privana/api/contracts/product";
import { readPostForm } from "./read-post-form";

export function hasUnsavedPostChanges(data: FormData, post?: PostDTO): boolean {
  const value = readPostForm(data, "DRAFT");
  const file = data.get("media");
  return (
    (file instanceof File && (file.size > 0 || Boolean(file.name))) ||
    value.title !== (post?.title.trim() ?? "") ||
    value.body !== (post?.body?.trim() ?? "") ||
    value.excerpt !== (post?.excerpt?.trim() ?? "") ||
    value.previewUrl !== (post?.previewUrl || null) ||
    value.visibility !== (post?.visibility ?? "PUBLIC")
  );
}
