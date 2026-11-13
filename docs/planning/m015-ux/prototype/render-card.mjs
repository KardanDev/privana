import { element } from "./element.mjs";
import { renderTable } from "./owner/render-table.mjs";
import { readCopy } from "./read-copy.mjs";
import { renderActions } from "./render-actions.mjs";

export function renderCard(card) {
  const section = element("section", "", { class: `card ${card.kind ?? ""}` });
  if (card.kind === "creator") {
    section.dataset.creator =
      `${card.title} ${card.text.join(" ")}`.toLocaleLowerCase("pt-BR");
  }
  if (!card.table) {
    section.append(element("h2", readCopy(card.title)));
  }
  if (card.byline) {
    section.append(element("p", card.byline, { class: "card-meta" }));
  }
  for (const text of card.text ?? []) {
    section.append(element("p", readCopy(text)));
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
  if (card.table) {
    section.append(renderTable(card.table));
  }
  return section;
}
