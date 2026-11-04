import type { DemoCurrency } from "./demo-types";

export function formatDemoCurrency(
  amountMinor: number,
  currency: DemoCurrency
): string {
  return new Intl.NumberFormat("pt-BR", { currency, style: "currency" }).format(
    amountMinor / 100
  );
}
