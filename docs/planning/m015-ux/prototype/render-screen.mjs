import { element } from "./element.mjs";
import { renderActions } from "./render-actions.mjs";
import { renderCard } from "./render-card.mjs";
import { renderNavigation } from "./render-navigation.mjs";
import { scenarios } from "./scenarios.mjs";

export function renderScreen() {
  const requested = location.hash.slice(1);
  const scenario =
    scenarios.find((item) => item.id === requested) ?? scenarios[0];
  const screen = document.getElementById("screen");
  const heading = element("h1", scenario.title, {
    id: "screen-title",
    tabindex: "-1",
  });
  screen.replaceChildren(
    heading,
    element("p", scenario.intro, { class: "intro" })
  );
  document.getElementById("scenario-note").textContent = scenario.notice;
  for (const card of scenario.cards) {
    screen.append(renderCard(card));
  }
  screen.append(renderActions(scenario.actions));
  renderNavigation(document.getElementById("side-navigation"), scenario);
  renderNavigation(document.getElementById("mobile-navigation"), scenario);
  document.getElementById("scenario").value = scenario.id;
  document.getElementById("route").textContent =
    `Tela de referência: ${scenario.route}`;
  document.title = `${scenario.label} · revisão Privana`;
  heading.focus({ preventScroll: true });
  window.scrollTo({ behavior: "instant", top: 0 });
}
