import { createCardCases } from "./create-card-cases.mjs";
import { currencies } from "./model.mjs";
import { pixScenarios } from "./pix.mjs";

export const checkoutScenarios = [
  ...currencies.flatMap(createCardCases),
  ...pixScenarios,
];
