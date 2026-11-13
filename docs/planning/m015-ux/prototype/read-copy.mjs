import { reviewState } from "./state.mjs";

export function readCopy(copy) {
  return typeof copy === "string"
    ? copy
    : String(reviewState.fields.get(copy.from) ?? copy.fallback);
}
