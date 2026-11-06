import { DEPLOYMENT_KEYS } from "./deployment-keys";
import type { SyncPlan, SyncTarget } from "./sync-types";
import { validateSyncValues } from "./validate-sync-values";
export function createSyncPlan(
  sources: Record<string, string | undefined>[],
  target: SyncTarget
): SyncPlan {
  const merged = new Map<string, string | undefined>();
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      merged.set(key, value);
    }
  }
  const values = new Map<string, string>();
  for (const key of DEPLOYMENT_KEYS) {
    const value = merged.get(key);
    if (value) {
      values.set(key, value);
    }
  }
  validateSyncValues(values, target);
  const allowed = new Set<string>(DEPLOYMENT_KEYS);
  return {
    entries: Array.from(values, ([key, value]) => ({ key, value })),
    skippedCount: Array.from(merged.keys()).filter((key) => !allowed.has(key))
      .length,
  };
}
