import { reviewState } from "../state.mjs";

export function syncCmsControls() {
  for (const button of document.querySelectorAll("[data-cms-clean]")) {
    button.disabled = reviewState.dirtyGroups.has(`cms-${button.dataset.role}`);
    if (button.dataset.target.endsWith("-publish-review")) {
      button.classList.toggle("primary", !button.disabled);
    }
  }
  for (const button of document.querySelectorAll('[data-command="save"]')) {
    button.classList.toggle(
      "primary",
      reviewState.dirtyGroups.has(`cms-${button.dataset.role}`)
    );
  }
  const screen = document.getElementById("screen");
  if (screen.dataset.cmsStatus === "true") {
    const group = `cms-${screen.dataset.cmsRole}`;
    document.getElementById("screen-feedback").textContent =
      `Rascunho v${reviewState.fields.get(`${group}:version`)} · Publicado v${reviewState.fields.get(`${group}:publishedVersion`)}${reviewState.dirtyGroups.has(group) ? " · Alterações locais não salvas" : " · Sem alterações locais"}`;
  }
}
