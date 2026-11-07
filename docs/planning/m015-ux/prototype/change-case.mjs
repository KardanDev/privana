export function changeCase(event) {
  const select = event.currentTarget;
  location.hash = `${select.dataset.prefix}${select.value}`;
}
