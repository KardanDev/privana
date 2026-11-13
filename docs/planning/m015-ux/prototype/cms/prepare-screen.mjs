import { reviewState } from "../state.mjs";
import { getCmsDocument } from "./document.mjs";

export function prepareCmsScreen(scenario) {
  if (!scenario.cmsRole) {
    return scenario;
  }
  const state = getCmsDocument(scenario.cmsRole);
  for (const [name, value] of Object.entries(state.saved)) {
    const key = `cms-${scenario.cmsRole}:${name}`;
    if (!reviewState.fields.has(key)) {
      reviewState.fields.set(key, value);
    }
  }
  if (scenario.cmsTab) {
    state.tab = scenario.cmsTab;
  }
  return scenario.id.endsWith("-invalid")
    ? {
        ...scenario,
        feedback:
          state.invalid?.message ?? "Revise os campos antes de continuar.",
        focusField: state.invalid?.field,
        invalidFields: [state.invalid?.field],
      }
    : scenario;
}
