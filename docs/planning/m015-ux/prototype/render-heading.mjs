import { element } from "./element.mjs";
import { readCopy } from "./read-copy.mjs";
import { renderActions } from "./render-actions.mjs";
import { renderNavigation } from "./render-navigation.mjs";

export function renderHeading(scenario) {
  const fragment = document.createDocumentFragment();
  const header = element("header", "", { class: "screen-heading" });
  header.append(
    element("h1", readCopy(scenario.title), {
      id: "screen-title",
      tabindex: "-1",
    }),
    element("p", scenario.intro, { class: "intro" })
  );
  if (scenario.topActions) {
    const actions = renderActions(scenario.topActions);
    actions.classList.add("heading-actions");
    header.append(actions);
  }
  fragment.append(header);
  if (scenario.tabs) {
    const tabs = element("nav", "", {
      "aria-label": "Seções do espaço de trabalho",
      class: "workspace-tabs",
    });
    renderNavigation(tabs, {
      ...scenario,
      active: scenario.tab,
      navigation: scenario.tabs,
    });
    fragment.append(tabs);
  }
  return fragment;
}
