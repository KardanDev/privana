import { createFieldInput } from "./create-field-input.mjs";
import { element } from "./element.mjs";

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
    label.append(createFieldInput(field, form.group, fieldInvalid));
    group.append(label);
  }
  return group;
}
