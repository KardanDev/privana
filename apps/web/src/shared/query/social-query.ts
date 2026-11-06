import type { Query } from "@tanstack/react-query";

const ROOTS = new Set([
  "social-stream",
  "creator-posts",
  "creator",
  "discovery",
  "creator-suggestions",
  "memberships",
  "feed",
  "creators",
  "studio",
]);

export function isSocialQuery(query: Query): boolean {
  const [first] = query.queryKey;
  const root: unknown = Array.isArray(first) ? first[0] : first;
  return typeof root === "string" && ROOTS.has(root);
}
