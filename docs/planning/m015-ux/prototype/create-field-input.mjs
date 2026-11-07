import { captureField } from "./capture-field.mjs";
import { createFieldSelect } from "./create-field-select.mjs";
import { element } from "./element.mjs";
import { reviewState } from "./state.mjs";

export function createFieldInput(field, group, invalid) {
  if (field.type === "select") {
    return createFieldSelect(field, group);
  }
  const tag = field.type === "textarea" ? "textarea" : "input";
  const input = element(tag, "", {
    autocomplete: "off",
    id: `field-${field.name}`,
  });
  if (tag === "input") {
    input.type = field.type ?? "text";
  }
  input.dataset.key = `${group}:${field.name}`;
  input.value = field.sensitive
    ? field.value
    : (reviewState.fields.get(input.dataset.key) ?? field.value ?? "");
  input.readOnly = Boolean(field.sensitive || field.readOnly);
  input.disabled = Boolean(field.disabled);
  input.required = Boolean(field.required);
  if (field.type === "checkbox") {
    input.checked = Boolean(
      reviewState.fields.get(input.dataset.key) ?? field.value
    );
  }
  for (const [name, value] of Object.entries({
    max: field.maxValue,
    maxlength: field.max,
    min: field.minValue,
    minlength: field.min,
    pattern: field.pattern,
    step: field.step,
  })) {
    if (value !== undefined) {
      input.setAttribute(name, String(value));
    }
  }
  if (field.scope === "creators") {
    input.dataset.filterCreators = "true";
  }
  if (invalid) {
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", "screen-feedback");
  }
  if (!input.readOnly) {
    input.addEventListener("input", captureField);
  }
  return input;
}
