const formatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
  timeZone: "America/Sao_Paulo",
});
export function formatDate(value: string | Date): string {
  return formatter.format(new Date(value));
}
