export function formatMinorCurrency(value: number, currency: string): string {
  const formatter = new Intl.NumberFormat("pt-BR", {
    currency,
    style: "currency",
  });
  const digits = formatter.resolvedOptions().maximumFractionDigits;
  if (digits === undefined) {
    throw new Error("Não foi possível determinar a precisão desta moeda.");
  }
  return formatter.format(value / 10 ** digits);
}
