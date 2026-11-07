import { completeScreen } from "./complete-screen.mjs";
import { element } from "./element.mjs";
import { renderActions } from "./render-actions.mjs";
import { renderCard } from "./render-card.mjs";
import { renderFields } from "./render-fields.mjs";
import { renderNavigation } from "./render-navigation.mjs";
import { renderSecondary } from "./render-secondary.mjs";
import { scenarios } from "./scenarios.mjs";
import { reviewState } from "./state.mjs";

export function renderScreen() {
  const requested = location.hash.slice(1);
  const scenario =
    scenarios.find((item) => item.id === requested) ?? scenarios[0];
  const previousScroll = window.scrollY;
  if (reviewState.current) {
    reviewState.scroll.set(reviewState.current, previousScroll);
  }
  const stage = document.getElementById("stage");
  stage.dataset.shell = scenario.shell ?? "fan";
  stage.dataset.layout = scenario.layout ?? "list";
  stage.querySelector(".sidebar .brand").href =
    `#${scenario.navigation[0].target}`;
  const screen = document.getElementById("screen");
  const heading = element("h1", scenario.title, {
    id: "screen-title",
    tabindex: "-1",
  });
  screen.replaceChildren(
    heading,
    element("p", scenario.intro, { class: "intro" })
  );
  if (scenario.feedback) {
    screen.append(
      element("p", scenario.feedback, {
        class: "notice",
        id: "screen-feedback",
        role: scenario.error ? "alert" : "status",
      })
    );
  }
  if (scenario.form && scenario.formPlacement !== "after") {
    screen.append(renderFields(scenario.form, scenario.invalidFields));
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
  screen.append(body);
  if (scenario.form && scenario.formPlacement === "after") {
    content.append(renderFields(scenario.form, scenario.invalidFields));
  }
  if (scenario.layout === "grid") {
    screen.append(element("p", "", { id: "search-status", role: "status" }));
  }
  const actionTarget = ["feed", "conversation"].includes(scenario.layout)
    ? content
    : screen;
  actionTarget.append(renderActions(scenario.actions));
  renderNavigation(document.getElementById("side-navigation"), scenario);
  renderNavigation(document.getElementById("mobile-navigation"), scenario);
  renderNavigation(document.getElementById("public-navigation"), scenario);
  document
    .getElementById("outcomes")
    .replaceChildren(
      ...(scenario.outcomes?.length ? [renderActions(scenario.outcomes)] : [])
    );
  completeScreen(scenario, previousScroll);
}
