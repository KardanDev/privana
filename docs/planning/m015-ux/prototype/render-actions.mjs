import { discardFields } from "./discard-fields.mjs";
import { element } from "./element.mjs";
import { guardClose } from "./guard-close.mjs";
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
      class: (action.primary ?? index === 0) ? "button primary" : "button",
      href: `#${action.target}`,
    });
    if (action.ariaLabel) {
      link.setAttribute("aria-label", action.ariaLabel);
    }
    if (action.validates) {
      link.addEventListener("click", validateFields);
    }
    if (action.guardGroup) {
      link.dataset.guardGroup = action.guardGroup;
      link.dataset.guardTarget = action.guardTarget;
      link.addEventListener("click", guardClose);
    }
    if (action.resetGroup) {
      link.dataset.resetGroup = action.resetGroup;
      link.dataset.resume = String(Boolean(action.resume));
      link.addEventListener("click", discardFields);
    }
    group.append(link);
  }
  return group;
}
