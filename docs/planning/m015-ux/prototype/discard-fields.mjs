import { reviewState } from "./state.mjs";

export function discardFields(event) {
  const link = event.currentTarget;
  const group = link.dataset.resetGroup;
  for (const key of reviewState.fields.keys()) {
    if (key.startsWith(`${group}:`)) {
      reviewState.fields.delete(key);
    }
  }
  reviewState.dirtyGroups.delete(group);
  const target = reviewState.leaveTargets.get(group);
  if (link.dataset.resume === "true" && target) {
    link.hash = target;
  }
  reviewState.leaveTargets.delete(group);
}
