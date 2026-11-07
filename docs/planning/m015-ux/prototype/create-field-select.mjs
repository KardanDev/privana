import { changeCase } from "./change-case.mjs";
import { element } from "./element.mjs";

export function createFieldSelect(field) {
  const select = element("select", "", { id: `field-${field.name}` });
  for (const option of field.options) {
    select.append(element("option", option.label, { value: option.value }));
  }
  select.value = field.value;
  select.dataset.prefix = field.casePrefix;
  select.addEventListener("change", changeCase);
  return select;
}
