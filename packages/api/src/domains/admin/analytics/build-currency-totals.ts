import type { AnalyticsCurrencyDTO } from "../../../contracts/platform";
export interface CurrencyAggregateRow {
  _count: { _all: number };
  _sum: { amountMinor: number | null };
  currency: string;
  kind: string;
  status: string;
}
export function buildCurrencyTotals(
  rows: CurrencyAggregateRow[]
): AnalyticsCurrencyDTO[] {
  const currencies = new Map<string, AnalyticsCurrencyDTO>();
  for (const row of rows) {
    const amount = row._sum.amountMinor ?? 0;
    if (
      !Number.isSafeInteger(amount) ||
      amount < 0 ||
      !Number.isSafeInteger(row._count._all)
    ) {
      throw new Error("Invalid ledger aggregate.");
    }
    const totals = currencies.get(row.currency) ?? {
      currency: row.currency,
      failedMinor: 0,
      pendingMinor: 0,
      receivedMinor: 0,
      refundedMinor: 0,
      transactionCount: 0,
    };
    if (row.status === "PENDING") {
      totals.pendingMinor += amount;
    } else if (row.status === "FAILED") {
      totals.failedMinor += amount;
    } else if (row.status === "SUCCEEDED" && row.kind === "CHARGE") {
      totals.receivedMinor += amount;
    } else if (row.status === "SUCCEEDED" && row.kind === "REFUND") {
      totals.refundedMinor += amount;
    } else {
      throw new Error("Unknown ledger kind or status.");
    }
    totals.transactionCount += row._count._all;
    if (
      !Object.values(totals).every(
        (value) => typeof value !== "number" || Number.isSafeInteger(value)
      )
    ) {
      throw new Error("Ledger total exceeds supported precision.");
    }
    currencies.set(row.currency, totals);
  }
  return [...currencies.values()].sort((left, right) =>
    left.currency.localeCompare(right.currency)
  );
}
