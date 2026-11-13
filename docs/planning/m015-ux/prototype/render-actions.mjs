import { element } from "./element.mjs";

export function renderActions(actions) {
  const group = element("div", "", { class: "actions" });
  for (const [index, action] of actions.entries()) {
    group.append(
      element("a", action.label, {
        class: index === 0 ? "button primary" : "button",
        href: `#${action.target}`,
      })
    );
  }
  return group;
}
