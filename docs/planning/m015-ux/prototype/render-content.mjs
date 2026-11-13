import { element } from "./element.mjs";
import { renderActions } from "./render-actions.mjs";
import { renderCard } from "./render-card.mjs";
import { renderFields } from "./render-fields.mjs";
import { renderSecondary } from "./render-secondary.mjs";

export function renderContent(scenario) {
  const fragment = document.createDocumentFragment();
  if (scenario.form && scenario.formPlacement !== "after") {
    fragment.append(renderFields(scenario.form, scenario.invalidFields));
  }
  const body = element("div", "", { class: "screen-body" });
  const content = element("div", "", {
    class: `content ${scenario.layout ?? "list"}`,
  });
  for (const card of scenario.cards) {
    content.append(renderCard(card));
  }
  body.append(content);
  if (scenario.secondary) {
    body.append(renderSecondary(scenario.secondary));
  }
  fragment.append(body);
  if (scenario.recordSearch) {
    fragment.append(element("p", "", { id: "records-status", role: "status" }));
  }
  if (scenario.form && scenario.formPlacement === "after") {
    content.append(renderFields(scenario.form, scenario.invalidFields));
  }
  if (scenario.layout === "grid") {
    fragment.append(element("p", "", { id: "search-status", role: "status" }));
  }
  const target = ["feed", "conversation", "checkout"].includes(scenario.layout)
    ? content
    : fragment;
  target.append(renderActions(scenario.actions));
  return fragment;
}
