import { reviewState } from "./state.mjs";

export function guardDestination(group, target, guardTarget) {
  if (!reviewState.dirtyGroups.has(group)) {
    return false;
  }
  reviewState.leaveTargets.set(group, target);
  location.hash = guardTarget;
  return true;
}
