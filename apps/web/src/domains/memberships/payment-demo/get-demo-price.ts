import type { DemoCurrency } from "./demo-types";

const ILLUSTRATIVE_PRICES: Record<Exclude<DemoCurrency, "BRL">, number> = {
  EUR: 890,
  USD: 990,
};

export function getDemoPrice(
  profilePriceCents: number,
  currency: DemoCurrency
): number {
  return currency === "BRL" ? profilePriceCents : ILLUSTRATIVE_PRICES[currency];
}
