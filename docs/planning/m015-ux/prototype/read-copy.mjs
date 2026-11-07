import { reviewState } from "./state.mjs";

export function readCopy(copy) {
  return typeof copy === "string"
    ? copy
    : `${copy.prefix ?? ""}${String(reviewState.fields.get(copy.from) ?? copy.fallback)}`;
}
