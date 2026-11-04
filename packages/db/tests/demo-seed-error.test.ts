import { expect, test } from "bun:test";
import { describeDemoSeedError } from "../scripts/demo/describe-demo-seed-error";

test("seed failures identify transaction expiry without exposing driver messages or credentials", () => {
  const result = describeDemoSeedError({
    code: "P2028",
    message: "private-database-url-and-password",
    meta: { query: "private-seed-values" },
  });
  expect(result).toContain("P2028");
  expect(result).toContain("transação");
  expect(result).not.toContain("private");
});

test("unknown seed errors and arbitrary codes are never printed", () => {
  expect(describeDemoSeedError(new Error("private-secret"))).not.toContain(
    "private"
  );
  expect(describeDemoSeedError({ code: "private-secret" })).not.toContain(
    "private"
  );
  expect(describeDemoSeedError({ code: "EEXIST" })).toContain("bloqueio");
});
