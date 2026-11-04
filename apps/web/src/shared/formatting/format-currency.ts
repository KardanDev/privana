const formatter = new Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  style: "currency",
});
export function formatCurrency(amountCents: number): string {
  return formatter.format(amountCents / 100);
}
