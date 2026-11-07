import { element } from "./element.mjs";
import { guardClose } from "./guard-close.mjs";
import { icon } from "./icon.mjs";

export function renderNavigation(target, scenario) {
  target.replaceChildren();
  const items =
    target.id === "mobile-navigation"
      ? (scenario.mobileNavigation ?? scenario.navigation)
      : scenario.navigation;
  for (const item of items) {
    const link = element("a", item.label, { href: `#${item.target}` });
    link.prepend(icon(item.icon));
    if (scenario.guardGroup) {
      link.dataset.guardGroup = scenario.guardGroup;
      link.dataset.guardTarget = scenario.guardTarget;
      link.addEventListener("click", guardClose);
    }
    if ((item.activeLabel ?? item.label) === scenario.active) {
      link.setAttribute("aria-current", "page");
    }
    target.append(link);
  }
}
