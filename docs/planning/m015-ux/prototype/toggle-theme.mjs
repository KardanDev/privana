export function toggleTheme(event) {
  const dark = document.body.classList.toggle("dark");
  event.currentTarget.setAttribute("aria-pressed", String(dark));
  event.currentTarget.textContent = dark ? "Tema claro" : "Tema escuro";
}
