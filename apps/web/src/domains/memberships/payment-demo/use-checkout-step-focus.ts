"use client";

import { useEffect, useRef } from "react";
import type { DemoStage } from "./demo-types";

export function useCheckoutStepFocus(stage: DemoStage) {
  const contentRef = useRef<HTMLElement>(null);
  const previousStage = useRef(stage);
  useEffect(() => {
    if (previousStage.current !== stage) {
      contentRef.current?.focus();
      previousStage.current = stage;
    }
  }, [stage]);
  return contentRef;
}
