import { reviewState } from "./state.mjs";

export function readCopy(copy) {
  if (typeof copy === "string") {
    return copy;
  }
  const value = reviewState.fields.get(copy.from) ?? copy.fallback;
  return `${copy.prefix ?? ""}${String(copy.labels?.[value] ?? value)}`;
}
