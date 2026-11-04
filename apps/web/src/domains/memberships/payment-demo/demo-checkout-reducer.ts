import { type DemoEvent, type DemoState, initialDemoState } from "./demo-types";
import { updateDemoSelection } from "./update-demo-selection";

export function demoCheckoutReducer(
  state: DemoState,
  event: DemoEvent
): DemoState {
  if (event.type === "RESET") {
    return { ...initialDemoState };
  }
  if (event.type === "BACK") {
    return { ...state, result: null, stage: "choose" };
  }
  if (state.stage === "choose") {
    return updateDemoSelection(state, event);
  }
  if (
    state.stage === "review" &&
    state.method === "pix" &&
    event.type === "GENERATE_PIX"
  ) {
    return { ...state, stage: "pix" };
  }
  const canApprove =
    state.stage === "pix" ||
    (state.stage === "review" && state.method === "card");
  const canDecline = state.stage === "review" && state.method === "card";
  if (
    (canApprove && event.type === "APPROVE") ||
    (canDecline && event.type === "DECLINE")
  ) {
    return {
      ...state,
      result: {
        accessGranted: false,
        chargedAmountMinor: 0,
        providerReference: null,
        simulated: true,
        status: event.type === "APPROVE" ? "approved" : "declined",
      },
      stage: "result",
    };
  }
  return state;
}
