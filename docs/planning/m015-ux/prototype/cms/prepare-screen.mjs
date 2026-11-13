import { reviewState } from "../state.mjs";
import { getCmsDocument } from "./document.mjs";

export function prepareCmsScreen(scenario) {
  if (!scenario.cmsRole) {
    return scenario;
  }
  const state = getCmsDocument(scenario.cmsRole);
  const group = `cms-${scenario.cmsRole}`;
  for (const [name, value] of Object.entries(state.saved)) {
    if (!reviewState.fields.has(`${group}:${name}`)) {
      reviewState.fields.set(`${group}:${name}`, value);
    }
  }
  reviewState.fields.set(`${group}:version`, String(state.version));
  reviewState.fields.set(`${group}:serverVersion`, String(state.serverVersion));
  reviewState.fields.set(
    `${group}:history`,
    [...state.history.keys()].join(", ")
  );
  reviewState.fields.set(
    `${group}:publishedVersion`,
    String(state.publishedVersion)
  );
  if (scenario.cmsTab) {
    state.tab = scenario.cmsTab;
  }
  if (scenario.id.endsWith("-invalid")) {
    return {
      ...scenario,
      feedback:
        state.invalid?.message ?? "Revise os campos antes de continuar.",
      focusField: state.invalid?.field,
      invalidFields: [state.invalid?.field],
    };
  }
  return scenario;
}
