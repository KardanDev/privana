import { reviewState } from "./state.mjs";

export function applyCaseState(scenario) {
  for (const [key, value] of Object.entries(scenario.fieldValues ?? {})) {
    reviewState.fields.set(key, value);
  }
  if (scenario.dirtyGroup) {
    reviewState.dirtyGroups.add(scenario.dirtyGroup);
  }
}
