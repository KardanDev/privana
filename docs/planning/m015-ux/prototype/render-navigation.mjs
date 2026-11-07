import { element } from "./element.mjs";
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
    if (item.label === scenario.active) {
      link.setAttribute("aria-current", "page");
    }
    target.append(link);
  }
}
