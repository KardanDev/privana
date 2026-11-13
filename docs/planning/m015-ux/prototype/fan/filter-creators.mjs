export function filterCreators() {
  const input = document.querySelector("[data-filter-creators]");
  if (!input) {
    return;
  }
  const query = input.value.trim().toLocaleLowerCase("pt-BR");
  let visible = 0;
  for (const card of document.querySelectorAll("[data-creator]")) {
    card.hidden = !card.dataset.creator.includes(query);
    if (!card.hidden) {
      visible += 1;
    }
  }
  const status = document.getElementById("search-status");
  if (status) {
    status.textContent = visible
      ? `${visible} perfil(is) de exemplo.`
      : "Nenhum perfil encontrado. Tente outro nome.";
  }
}
