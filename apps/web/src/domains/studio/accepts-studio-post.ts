import type { QueryKey } from "@tanstack/react-query";

export function acceptsStudioPost(key: QueryKey, status: string): boolean {
  const filter = key.at(-1);
  const selection =
    filter && typeof filter === "object" && "status" in filter
      ? filter.status
      : "ACTIVE";
  return selection === "ACTIVE" ? status !== "ARCHIVED" : selection === status;
}
