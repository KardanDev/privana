import { applyCaseState } from "./apply-case-state.mjs";
import { completeScreen } from "./complete-screen.mjs";
import { element } from "./element.mjs";
import { renderActions } from "./render-actions.mjs";
import { renderContent } from "./render-content.mjs";
import { renderHeading } from "./render-heading.mjs";
import { renderNavigation } from "./render-navigation.mjs";
import { scenarios } from "./scenarios.mjs";
import { reviewState } from "./state.mjs";

export function renderScreen() {
  const requested = location.hash.slice(1);
  const scenario =
    scenarios.find((item) => item.id === requested) ?? scenarios[0];
  applyCaseState(scenario);
  const previousScroll = window.scrollY;
  if (reviewState.current) {
    reviewState.scroll.set(reviewState.current, previousScroll);
  }
  const stage = document.getElementById("stage");
  stage.dataset.shell = scenario.shell ?? "fan";
  stage.dataset.layout = scenario.layout ?? "list";
  stage.querySelector(".sidebar .brand").href =
    `#${scenario.navigation[0].target}`;
  stage.querySelector(".sidebar .brand").dataset.guardGroup =
    scenario.guardGroup ?? "";
  stage.querySelector(".sidebar .brand").dataset.guardTarget =
    scenario.guardTarget ?? "";
  const screen = document.getElementById("screen");
  screen.replaceChildren(renderHeading(scenario));
  if (scenario.feedback) {
    screen.append(
      element("p", scenario.feedback, {
        class: "notice",
        id: "screen-feedback",
        role: scenario.error ? "alert" : "status",
      })
    );
  }
  screen.append(renderContent(scenario));
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
