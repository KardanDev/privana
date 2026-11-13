import { syncCmsControls } from "./cms/sync-controls.mjs";
import { filterCreators } from "./fan/filter-creators.mjs";
import { filterRecords } from "./owner/filter-records.mjs";
import { reviewState } from "./state.mjs";

export function captureField(event) {
  const input = event.currentTarget;
  input.setCustomValidity("");
  if (input.dataset.dirtyGroup) {
    reviewState.dirtyGroups.add(input.dataset.dirtyGroup);
  }
  reviewState.fields.set(
    input.dataset.key,
    input.type === "checkbox" ? input.checked : input.value
  );
  filterCreators();
  filterRecords();
  syncCmsControls();
}
