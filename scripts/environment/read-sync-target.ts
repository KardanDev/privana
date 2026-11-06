import type { SyncTarget } from "./sync-types";

export function readSyncTarget(value: string | undefined): SyncTarget {
  if (
    value === "development" ||
    value === "preview" ||
    value === "production"
  ) {
    return value;
  }
  throw new Error(
    "An explicit development, preview or production target is required."
  );
}
