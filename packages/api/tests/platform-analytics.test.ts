import { expect, test } from "bun:test";
import { buildCurrencyTotals } from "../src/domains/admin/analytics/build-currency-totals";
import { buildDailySeries } from "../src/domains/admin/analytics/build-daily-series";

test("ledger totals preserve currency and separate charges, refunds and unresolved entries", () => {
  const totals = buildCurrencyTotals([
    {
      _count: { _all: 2 },
      _sum: { amountMinor: 12_000 },
      currency: "BRL",
      kind: "CHARGE",
      status: "SUCCEEDED",
    },
    {
      _count: { _all: 1 },
      _sum: { amountMinor: 3000 },
      currency: "USD",
      kind: "CHARGE",
      status: "SUCCEEDED",
    },
    {
      _count: { _all: 1 },
      _sum: { amountMinor: 2000 },
      currency: "BRL",
      kind: "REFUND",
      status: "SUCCEEDED",
    },
    {
      _count: { _all: 1 },
      _sum: { amountMinor: 500 },
      currency: "BRL",
      kind: "CHARGE",
      status: "PENDING",
    },
    {
      _count: { _all: 1 },
      _sum: { amountMinor: 100 },
      currency: "USD",
      kind: "CHARGE",
      status: "FAILED",
    },
  ]);
  expect(totals).toEqual([
    {
      currency: "BRL",
      failedMinor: 0,
      pendingMinor: 500,
      receivedMinor: 12_000,
      refundedMinor: 2000,
      transactionCount: 4,
    },
    {
      currency: "USD",
      failedMinor: 100,
      pendingMinor: 0,
      receivedMinor: 3000,
      refundedMinor: 0,
      transactionCount: 2,
    },
  ]);
});
test("empty analytics have truthful zeros and UTC day boundaries", () => {
  const daily = buildDailySeries(
    [{ count: 2, date: "2026-10-25", kind: "users" }],
    7,
    new Date("2026-10-26T00:30:00Z")
  );
  expect(daily).toHaveLength(7);
  expect(daily[0]?.date).toBe("2026-10-20");
  expect(daily[5]?.users).toBe(2);
  expect(daily[6]).toEqual({
    date: "2026-10-26",
    posts: 0,
    subscriptions: 0,
    transactions: 0,
    users: 0,
  });
  expect(buildCurrencyTotals([])).toEqual([]);
});
test("unsafe ledger precision is rejected instead of returning rounded currency totals", () => {
  expect(() =>
    buildCurrencyTotals([
      {
        _count: { _all: 1 },
        _sum: { amountMinor: Number.MAX_SAFE_INTEGER + 1 },
        currency: "BRL",
        kind: "CHARGE",
        status: "SUCCEEDED",
      },
    ])
  ).toThrow();
});
