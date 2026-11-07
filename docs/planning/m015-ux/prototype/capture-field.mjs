import { filterCreators } from "./fan/filter-creators.mjs";
import { reviewState } from "./state.mjs";

export function captureField(event) {
  const input = event.currentTarget;
  input.setCustomValidity("");
  reviewState.fields.set(
    input.dataset.key,
    input.type === "checkbox" ? input.checked : input.value
  );
  filterCreators();
}
