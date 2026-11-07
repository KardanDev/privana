import { element } from "./element.mjs";
import { renderCard } from "./render-card.mjs";

export function renderSecondary(secondary) {
  const aside = element("aside", "", {
    "aria-label": secondary.title,
    class: "secondary",
  });
  aside.append(element("h2", secondary.title));
  for (const card of secondary.cards) {
    aside.append(renderCard(card));
  }
  return aside;
}
