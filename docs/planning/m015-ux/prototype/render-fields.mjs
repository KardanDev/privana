import { createFieldInput } from "./create-field-input.mjs";
import { element } from "./element.mjs";

export function renderFields(form, invalid) {
  const group = element("fieldset", "", { class: "fields" });
  group.append(element("legend", form.legend));
  for (const field of form.fields) {
    const label = element("label", field.label);
    label.append(createFieldInput(field, form.group, invalid));
    group.append(label);
  }
  return group;
}
