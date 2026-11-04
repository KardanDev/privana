export type DemoCurrency = "BRL" | "USD" | "EUR";
export type DemoMethod = "card" | "pix";
export type DemoStage = "choose" | "review" | "pix" | "result";

export interface DemoCreator {
  avatarUrl: string | null;
  handle: string;
  name: string;
  priceCents: number;
  sample: boolean;
}
export interface DemoResult {
  accessGranted: false;
  chargedAmountMinor: 0;
  providerReference: null;
  simulated: true;
  status: "approved" | "declined";
}
export interface DemoState {
  currency: DemoCurrency;
  method: DemoMethod;
  result: DemoResult | null;
  stage: DemoStage;
}
export type DemoEvent =
  | { type: "METHOD"; method: DemoMethod }
  | { type: "CURRENCY"; currency: DemoCurrency }
  | { type: "REVIEW" }
  | { type: "GENERATE_PIX" }
  | { type: "APPROVE" }
  | { type: "DECLINE" }
  | { type: "BACK" }
  | { type: "RESET" };
export interface TestCard {
  cvc: string;
  expiry: string;
  number: string;
}
export interface TestCardErrors {
  cvc?: string;
  expiry?: string;
  number?: string;
}

export const initialDemoState: DemoState = {
  currency: "BRL",
  method: "card",
  result: null,
  stage: "choose",
};
export const TEST_CARD: TestCard = {
  cvc: "123",
  expiry: "12/30",
  number: "4242 4242 4242 4242",
};
export const DEMO_PIX_CODE = "DEMONSTRACAO-PIX-NAO-PAGAVEL-SEM-VALOR";
export const PIX_DEMO_DURATION_SECONDS = 300;
