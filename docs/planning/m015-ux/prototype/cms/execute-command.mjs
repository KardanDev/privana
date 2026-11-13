import { reviewState } from "../state.mjs";
import { commitCmsCommand } from "./commit-command.mjs";
import { getCmsDocument } from "./document.mjs";
import { readCmsDraft } from "./read-draft.mjs";
import { validateCmsDraft } from "./validate-draft.mjs";

export function executeCmsCommand(event) {
  const { role, command, target } = event.currentTarget.dataset;
  const state = getCmsDocument(role);
  const group = `cms-${role}`;
  let destination = target;
  if (["save", "preview"].includes(command)) {
    state.invalid = validateCmsDraft(readCmsDraft(role));
    if (state.invalid) {
      destination = `cms-${role}-${state.invalid.tab}-invalid`;
    } else {
      state.pendingDraft = readCmsDraft(role);
    }
  }
  if (["save", "publish", "restore"].includes(command)) {
    state.expected = state.version;
  }
  if (
    command.startsWith("commit-") &&
    !commitCmsCommand(role, command.slice(7))
  ) {
    destination = `cms-${role}-conflict`;
  }
  if (command === "conflict") {
    state.serverVersion += 1;
    state.saved = {
      ...state.saved,
      tagline: "Uma edição feita por outra pessoa.",
    };
  }
  if (["discard", "reload"].includes(command)) {
    state.version = state.serverVersion;
    for (const [name, value] of Object.entries(state.saved)) {
      reviewState.fields.set(`${group}:${name}`, value);
    }
    reviewState.dirtyGroups.delete(group);
    if (command === "discard") {
      destination = reviewState.leaveTargets.get(group) ?? `owner-${role}-cms`;
    }
    reviewState.leaveTargets.delete(group);
  }
  if (destination === "editor") {
    destination = `cms-${role}-${state.tab}`;
  }
  location.hash = destination;
}
