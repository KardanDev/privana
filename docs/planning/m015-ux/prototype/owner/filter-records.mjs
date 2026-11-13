export function filterRecords() {
  const search = document.querySelector('[data-filter-records="search"]');
  if (!search) {
    return;
  }
  const query = search.value.trim().toLocaleLowerCase("pt-BR");
  const status = document.querySelector(
    '[data-filter-records="status"]'
  )?.value;
  let visible = 0;
  for (const row of document.querySelectorAll("[data-record]")) {
    row.hidden =
      !row.dataset.record.includes(query) ||
      Boolean(status && row.dataset.status !== status);
    if (!row.hidden) {
      visible += 1;
    }
  }
  document.getElementById("records-status").textContent = visible
    ? `${visible} registro(s) de exemplo. Todos os dados são fictícios.`
    : "Nenhum registro corresponde aos filtros. Limpe a busca ou escolha outra situação.";
}
