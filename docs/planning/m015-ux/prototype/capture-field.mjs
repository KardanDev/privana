import { filterCreators } from "./fan/filter-creators.mjs";
import { reviewState } from "./state.mjs";

export function captureField(event) {
  const input = event.currentTarget;
  reviewState.fields.set(input.dataset.key, input.value);
  filterCreators();
}
