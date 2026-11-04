import { expect, test } from "bun:test";
import { demoCheckoutReducer } from "../../src/domains/memberships/payment-demo/demo-checkout-reducer";
import { initialDemoState } from "../../src/domains/memberships/payment-demo/demo-types";
import { getDemoPrice } from "../../src/domains/memberships/payment-demo/get-demo-price";
import { validateTestCard } from "../../src/domains/memberships/payment-demo/validate-test-card";

test("checkout only accepts the explicitly advertised test card, expiry and CVC", () => {
  expect(
    validateTestCard({
      cvc: "123",
      expiry: "12/30",
      number: "4242 4242 4242 4242",
    })
  ).toEqual({});
  expect(
    validateTestCard({
      cvc: "123",
      expiry: "12/30",
      number: "5555555555554444",
    }).number
  ).toBeDefined();
  expect(
    validateTestCard({
      cvc: "123",
      expiry: "01/27",
      number: "4242424242424242",
    }).expiry
  ).toBeDefined();
  expect(
    validateTestCard({
      cvc: "456",
      expiry: "12/30",
      number: "4242424242424242",
    }).cvc
  ).toBeDefined();
});

test("a card simulation requires review and never records a charge or grants access", () => {
  expect(demoCheckoutReducer(initialDemoState, { type: "APPROVE" })).toEqual(
    initialDemoState
  );
  const review = demoCheckoutReducer(initialDemoState, { type: "REVIEW" });
  const completed = demoCheckoutReducer(review, { type: "APPROVE" });
  expect(completed.stage).toBe("result");
  expect(completed.result).toEqual({
    accessGranted: false,
    chargedAmountMinor: 0,
    providerReference: null,
    simulated: true,
    status: "approved",
  });
  expect(JSON.stringify(completed)).not.toContain("4242");
  expect(demoCheckoutReducer(completed, { type: "RESET" })).toEqual(
    initialDemoState
  );
});

test("Pix requires a BRL review and an illustrative-code step before approval", () => {
  const pix = demoCheckoutReducer(initialDemoState, {
    method: "pix",
    type: "METHOD",
  });
  const review = demoCheckoutReducer(pix, { type: "REVIEW" });
  expect(demoCheckoutReducer(review, { type: "APPROVE" }).stage).toBe("review");
  const generated = demoCheckoutReducer(review, { type: "GENERATE_PIX" });
  expect(generated.stage).toBe("pix");
  const completed = demoCheckoutReducer(generated, { type: "APPROVE" });
  expect(completed.result?.accessGranted).toBe(false);
  expect(completed.result?.chargedAmountMinor).toBe(0);
  const usd = demoCheckoutReducer(pix, { currency: "USD", type: "CURRENCY" });
  expect(usd.method).toBe("card");
  expect(
    demoCheckoutReducer(usd, { method: "pix", type: "METHOD" }).method
  ).toBe("card");
});

test("demo prices are explicit independent examples and preserve the BRL profile amount", () => {
  expect(getDemoPrice(3750, "BRL")).toBe(3750);
  expect(getDemoPrice(3750, "USD")).toBe(990);
  expect(getDemoPrice(3750, "EUR")).toBe(890);
});

test("a declined card stays uncharged and can return to the chosen currency", () => {
  const eur = demoCheckoutReducer(initialDemoState, {
    currency: "EUR",
    type: "CURRENCY",
  });
  const review = demoCheckoutReducer(eur, { type: "REVIEW" });
  const declined = demoCheckoutReducer(review, { type: "DECLINE" });
  expect(declined.result?.status).toBe("declined");
  expect(declined.result?.chargedAmountMinor).toBe(0);
  expect(declined.result?.accessGranted).toBe(false);
  expect(demoCheckoutReducer(declined, { type: "APPROVE" })).toEqual(declined);
  const back = demoCheckoutReducer(declined, { type: "BACK" });
  expect(back.stage).toBe("choose");
  expect(back.currency).toBe("EUR");
  expect(back.result).toBeNull();
});

test("review cannot switch payment details or produce a card approval for Pix", () => {
  const pix = demoCheckoutReducer(initialDemoState, {
    method: "pix",
    type: "METHOD",
  });
  const review = demoCheckoutReducer(pix, { type: "REVIEW" });
  expect(
    demoCheckoutReducer(review, { currency: "USD", type: "CURRENCY" })
  ).toEqual(review);
  expect(
    demoCheckoutReducer(review, { method: "card", type: "METHOD" })
  ).toEqual(review);
  expect(demoCheckoutReducer(review, { type: "DECLINE" })).toEqual(review);
  const cardReview = demoCheckoutReducer(initialDemoState, { type: "REVIEW" });
  expect(demoCheckoutReducer(cardReview, { type: "GENERATE_PIX" })).toEqual(
    cardReview
  );
});
