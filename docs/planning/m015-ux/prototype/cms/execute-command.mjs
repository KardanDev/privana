import { getCmsDocument } from "./document.mjs";
import { readCmsDraft } from "./read-draft.mjs";
import { validateCmsDraft } from "./validate-draft.mjs";

export function executeCmsCommand(event) {
  const { role, command, target } = event.currentTarget.dataset;
  const state = getCmsDocument(role);
  if (command === "preview") {
    state.invalid = validateCmsDraft(readCmsDraft(role));
    if (state.invalid) {
      location.hash = `cms-${role}-${state.invalid.tab}-invalid`;
      return;
    }
  }
  location.hash = target === "editor" ? `cms-${role}-${state.tab}` : target;
}
