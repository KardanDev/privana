import { reviewState } from "./state.mjs";

export function guardClose(event) {
  const link = event.currentTarget;
  const group = link.dataset.guardGroup;
  if (!reviewState.dirtyGroups.has(group)) {
    return;
  }
  event.preventDefault();
  reviewState.leaveTargets.set(group, link.hash.slice(1));
  location.hash = link.dataset.guardTarget;
}
