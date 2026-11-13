import { createFieldInput } from "./create-field-input.mjs";
import { element } from "./element.mjs";
import { revealFocus } from "./reveal-focus.mjs";

export function renderFields(form, invalid) {
  const group = element("fieldset", "", {
    class: `fields ${form.layout ?? ""}`,
  });
  group.append(element("legend", form.legend));
  for (const field of form.fields) {
    const label = element("label", field.label);
    const fieldInvalid = Array.isArray(invalid)
      ? invalid.includes(field.name)
      : Boolean(invalid);
    const input = createFieldInput(field, form.group, fieldInvalid);
    input.addEventListener("focus", () => revealFocus(input));
    if (form.trackDirty) {
      input.dataset.dirtyGroup = form.group;
    }
    label.append(input);
    if (field.hint) {
      label.append(element("small", field.hint));
    }
    group.append(label);
  }
  return group;
}
