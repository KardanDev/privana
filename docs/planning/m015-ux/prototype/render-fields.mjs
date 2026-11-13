import { createFieldInput } from "./create-field-input.mjs";
import { element } from "./element.mjs";
import { revealFocus } from "./reveal-focus.mjs";

export function renderFields(form, invalid) {
  const group = element("fieldset", "", {
    class: `fields ${form.layout ?? ""}`,
  });
  group.append(element("legend", form.legend));
  for (const field of form.fields) {
    const label = element("label");
    const labelId = `label-${field.name}`;
    label.append(element("span", field.label, { id: labelId }));
    const fieldInvalid = Array.isArray(invalid)
      ? invalid.includes(field.name)
      : Boolean(invalid);
    const input = createFieldInput(field, form.group, fieldInvalid);
    input.setAttribute("aria-labelledby", labelId);
    input.addEventListener("focus", () => {
      // Pointer focus must not move a control before its click completes.
      if (input.matches(":focus-visible")) {
        revealFocus(input);
      }
    });
    if (form.trackDirty) {
      input.dataset.dirtyGroup = form.group;
    }
    label.append(input);
    if (field.hint) {
      const hintId = `hint-${field.name}`;
      label.append(element("small", field.hint, { id: hintId }));
      input.setAttribute(
        "aria-describedby",
        `${input.getAttribute("aria-describedby") ?? ""} ${hintId}`.trim()
      );
    }
    group.append(label);
  }
  return group;
}
