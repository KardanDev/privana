import { captureField } from "./capture-field.mjs";
import { changeCase } from "./change-case.mjs";
import { element } from "./element.mjs";
import { reviewState } from "./state.mjs";

export function createFieldSelect(field, group) {
  const select = element("select", "", { id: `field-${field.name}` });
  for (const option of field.options) {
    select.append(element("option", option.label, { value: option.value }));
  }
  select.dataset.key = `${group}:${field.name}`;
  if (field.guardGroup) {
    select.dataset.guardGroup = field.guardGroup;
    select.dataset.guardTarget = field.guardTarget;
  }
  if (field.scope === "records") {
    select.dataset.filterRecords = field.name;
  }
  select.disabled = Boolean(field.disabled);
  select.required = Boolean(field.required);
  if (field.casePrefix) {
    select.value = field.value;
    select.dataset.prefix = field.casePrefix;
    select.addEventListener("change", changeCase);
  } else {
    select.value = String(
      reviewState.fields.get(select.dataset.key) ?? field.value
    );
    select.addEventListener("change", captureField);
  }
  return select;
}
