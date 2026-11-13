import { element } from "./element.mjs";
import { renderScreen } from "./render-screen.mjs";
import { scenarios } from "./scenarios.mjs";
import { toggleTheme } from "./toggle-theme.mjs";

const select = document.getElementById("scenario");
for (const scenario of scenarios) {
  select.append(element("option", scenario.label, { value: scenario.id }));
}
select.addEventListener("change", (event) => {
  location.hash = event.currentTarget.value;
});
document.getElementById("theme").addEventListener("click", toggleTheme);
window.addEventListener("hashchange", () => {
  if (location.hash !== "#screen-title") {
    renderScreen();
  }
});
renderScreen();
