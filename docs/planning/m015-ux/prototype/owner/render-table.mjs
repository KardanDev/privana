import { element } from "../element.mjs";
import { renderActions } from "../render-actions.mjs";

export function renderTable(data) {
  const table = element("table", "", { class: "records" });
  table.append(element("caption", data.caption));
  const head = element("thead");
  const heading = element("tr");
  for (const column of data.columns) {
    heading.append(element("th", column, { scope: "col" }));
  }
  head.append(heading);
  const body = element("tbody");
  for (const item of data.rows) {
    const row = element("tr");
    row.dataset.record = item.cells.join(" ").toLocaleLowerCase("pt-BR");
    row.dataset.status = item.status ?? "";
    for (const [index, value] of item.cells.entries()) {
      row.append(element("td", value, { "data-label": data.columns[index] }));
    }
    if (data.columns.at(-1) === "Ações") {
      const cell = element("td", "", { "data-label": "Ações" });
      if (item.actions.length) {
        cell.append(renderActions(item.actions));
      } else {
        cell.textContent = "Somente consulta";
      }
      row.append(cell);
    }
    body.append(row);
  }
  table.append(head, body);
  return table;
}
