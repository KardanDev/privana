import { element } from "./element.mjs";
import { renderActions } from "./render-actions.mjs";

export function renderCard(card) {
  const section = element("section", "", { class: `card ${card.kind ?? ""}` });
  if (card.kind === "creator") {
    section.dataset.creator =
      `${card.title} ${card.text.join(" ")}`.toLocaleLowerCase("pt-BR");
  }
  section.append(element("h2", card.title));
  for (const text of card.text ?? []) {
    section.append(element("p", text));
  }
  if (card.image) {
    const image = element("img", "", {
      alt: card.alt,
      loading: "lazy",
      src: card.image,
    });
    if (card.kind === "creator") {
      section.prepend(image);
    } else {
      section.append(image);
    }
  }
  if (card.actions) {
    section.append(renderActions(card.actions));
  }
  return section;
}
