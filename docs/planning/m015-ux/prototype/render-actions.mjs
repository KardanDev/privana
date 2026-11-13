import { element } from "./element.mjs";
import { validateFields } from "./validate-fields.mjs";

export function renderActions(actions) {
  const group = element("div", "", { class: "actions" });
  for (const [index, action] of actions.entries()) {
    if (action.disabled) {
      const button = element("button", action.label, {
        disabled: "",
        type: "button",
      });
      group.append(button);
      continue;
    }
    const link = element("a", action.label, {
      class: index === 0 ? "button primary" : "button",
      href: `#${action.target}`,
    });
    if (action.ariaLabel) {
      link.setAttribute("aria-label", action.ariaLabel);
    }
    if (action.validates) {
      link.addEventListener("click", validateFields);
    }
    group.append(link);
  }
  return group;
}
