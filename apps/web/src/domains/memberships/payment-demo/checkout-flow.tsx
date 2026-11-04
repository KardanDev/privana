"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCallback, useReducer } from "react";
import { CheckoutSteps } from "./checkout-steps";
import { demoCheckoutReducer } from "./demo-checkout-reducer";
import { DemoCurrencySelect } from "./demo-currency-select";
import { DemoMethodForm } from "./demo-method-form";
import { DemoMethodPicker } from "./demo-method-picker";
import { DemoNotice } from "./demo-notice";
import { DemoOutcome } from "./demo-outcome";
import { DemoPix } from "./demo-pix";
import { DemoReview } from "./demo-review";
import { DemoSummary } from "./demo-summary";
import {
  type DemoCreator,
  type DemoCurrency,
  type DemoMethod,
  initialDemoState,
} from "./demo-types";
import { useCheckoutStepFocus } from "./use-checkout-step-focus";

export function CheckoutFlow({ creator }: { creator: DemoCreator }) {
  const [state, dispatch] = useReducer(demoCheckoutReducer, initialDemoState);
  const contentRef = useCheckoutStepFocus(state.stage);
  const changeCurrency = useCallback(
    (currency: DemoCurrency) => dispatch({ currency, type: "CURRENCY" }),
    []
  );
  const changeMethod = useCallback(
    (method: DemoMethod) => dispatch({ method, type: "METHOD" }),
    []
  );
  const review = useCallback(() => dispatch({ type: "REVIEW" }), []);
  const approve = useCallback(() => dispatch({ type: "APPROVE" }), []);
  const decline = useCallback(() => dispatch({ type: "DECLINE" }), []);
  const pix = useCallback(() => dispatch({ type: "GENERATE_PIX" }), []);
  const back = useCallback(() => dispatch({ type: "BACK" }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <Link
        className="flex w-fit items-center gap-2 rounded text-muted-foreground text-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        href={creator.sample ? "/explore" : `/creators/${creator.handle}`}
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        {creator.sample ? "Explorar criadores" : "Voltar ao perfil"}
      </Link>
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">
          Testar assinatura
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Checkout de exemplo ·{" "}
          {creator.sample ? "perfil fictício" : creator.name}
        </p>
      </div>
      <DemoNotice />
      <CheckoutSteps stage={state.stage} />
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section
          aria-label="Etapa do checkout"
          className="flex min-w-0 flex-col gap-6 rounded-xl border bg-card p-5 outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-6"
          ref={contentRef}
          tabIndex={-1}
        >
          {state.stage === "choose" ? (
            <>
              <DemoCurrencySelect
                currency={state.currency}
                onChange={changeCurrency}
              />
              <DemoMethodPicker
                currency={state.currency}
                method={state.method}
                onChange={changeMethod}
              />
              <DemoMethodForm
                key={`${state.currency}-${state.method}`}
                method={state.method}
                onReview={review}
              />
            </>
          ) : null}
          {state.stage === "review" ? (
            <DemoReview
              currency={state.currency}
              method={state.method}
              onApprove={approve}
              onBack={back}
              onDecline={decline}
              onPix={pix}
            />
          ) : null}
          {state.stage === "pix" ? (
            <DemoPix onApprove={approve} onBack={back} />
          ) : null}
          {state.stage === "result" && state.result ? (
            <DemoOutcome
              creator={creator}
              onReset={reset}
              result={state.result}
            />
          ) : null}
        </section>
        <DemoSummary
          creator={creator}
          currency={state.currency}
          method={state.method}
        />
      </div>
    </div>
  );
}
