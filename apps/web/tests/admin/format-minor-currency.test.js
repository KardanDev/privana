import { expect, test } from "bun:test";
import { formatMinorCurrency } from "../../src/domains/admin/format-minor-currency";

test("minor units respect each currency's own precision", () => {
  expect(formatMinorCurrency(12_345, "BRL")).toContain("123,45");
  expect(formatMinorCurrency(12_345, "USD")).toContain("123,45");
  expect(formatMinorCurrency(12_345, "JPY")).toContain("12.345");
  expect(formatMinorCurrency(12_345, "BHD")).toContain("12,345");
});

test("zero ledger amounts remain truthful zero values", () => {
  expect(formatMinorCurrency(0, "BRL")).toContain("0,00");
  expect(formatMinorCurrency(0, "JPY")).toContain("0");
});
