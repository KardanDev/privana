import { reviewState } from "../state.mjs";
import { getCmsDocument } from "./document.mjs";

export function commitCmsCommand(role, kind) {
  const state = getCmsDocument(role);
  const group = `cms-${role}`;
  if (state.expected !== state.serverVersion) {
    return false;
  }
  state.serverVersion += 1;
  state.version = state.serverVersion;
  if (kind === "save") {
    state.saved = { ...(state.pendingDraft ?? state.saved) };
  }
  if (kind === "publish") {
    state.published = { ...state.saved };
    state.publishedVersion = state.version;
    state.history.set(state.version, { ...state.saved });
  }
  if (kind === "restore") {
    state.saved = { ...state.history.get(2) };
  }
  for (const [name, value] of Object.entries(state.saved)) {
    reviewState.fields.set(`${group}:${name}`, value);
  }
  reviewState.dirtyGroups.delete(group);
  return true;
}
