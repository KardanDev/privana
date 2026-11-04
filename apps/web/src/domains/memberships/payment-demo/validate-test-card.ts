import { TEST_CARD, type TestCard, type TestCardErrors } from "./demo-types";

const SPACES = /\s/g;

export function validateTestCard(card: TestCard): TestCardErrors {
  const errors: TestCardErrors = {};
  if (
    card.number.replace(SPACES, "") !== TEST_CARD.number.replace(SPACES, "")
  ) {
    errors.number = "Use somente o cartão de teste 4242 4242 4242 4242.";
  }
  if (card.expiry !== TEST_CARD.expiry) {
    errors.expiry = "Use a validade de teste 12/30.";
  }
  if (card.cvc !== TEST_CARD.cvc) {
    errors.cvc = "Use o CVC de teste 123.";
  }
  return errors;
}
