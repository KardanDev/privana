import { filterCreators } from "./fan/filter-creators.mjs";
import { revealFocus } from "./reveal-focus.mjs";
import { reviewState } from "./state.mjs";

export function completeScreen(scenario, previousScroll) {
  document.getElementById("scenario").value = scenario.id;
  document.getElementById("route").textContent =
    `Tela de referência: ${scenario.route}`;
  document.getElementById("scenario-note").textContent =
    scenario.notice ?? "Caso fictício; nenhuma operação real.";
  document.title = `${scenario.label} · revisão Privana`;
  filterCreators();
  const target = document.getElementById(
    scenario.focusField ? `field-${scenario.focusField}` : "screen-title"
  );
  target?.focus({ preventScroll: true });
  window.scrollTo({
    behavior: "instant",
    top: scenario.preserveScroll
      ? previousScroll
      : (reviewState.scroll.get(scenario.id) ?? 0),
  });
  reviewState.current = scenario.id;
  if (scenario.focusField && target) {
    revealFocus(target);
  }
}
