import type { DemoEvent, DemoState } from "./demo-types";

export function updateDemoSelection(
  state: DemoState,
  event: DemoEvent
): DemoState {
  if (event.type === "CURRENCY") {
    return {
      ...state,
      currency: event.currency,
      method: event.currency === "BRL" ? state.method : "card",
    };
  }
  if (event.type === "METHOD") {
    return event.method === "pix" && state.currency !== "BRL"
      ? state
      : { ...state, method: event.method };
  }
  if (event.type === "REVIEW") {
    return { ...state, stage: "review" };
  }
  return state;
}
