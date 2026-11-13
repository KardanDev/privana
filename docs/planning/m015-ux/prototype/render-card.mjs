import { element } from "./element.mjs";

export function renderCard(card) {
  const section = element("section", "", { class: "card" });
  section.append(element("h2", card.title));
  for (const text of card.text) {
    section.append(element("p", text));
  }
  if (card.image) {
    section.append(element("img", "", { alt: card.alt, src: card.image }));
  }
  return section;
}
