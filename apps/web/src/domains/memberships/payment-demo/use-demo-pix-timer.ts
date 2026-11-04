"use client";

import { useCallback, useEffect, useState } from "react";
import { PIX_DEMO_DURATION_SECONDS } from "./demo-types";

export function useDemoPixTimer() {
  const [expiresAt, setExpiresAt] = useState(
    () => Date.now() + PIX_DEMO_DURATION_SECONDS * 1000
  );
  const [remaining, setRemaining] = useState(PIX_DEMO_DURATION_SECONDS);
  useEffect(() => {
    const timer = window.setInterval(
      () =>
        setRemaining(Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000))),
      1000
    );
    return () => window.clearInterval(timer);
  }, [expiresAt]);
  const restart = useCallback(() => {
    setExpiresAt(Date.now() + PIX_DEMO_DURATION_SECONDS * 1000);
    setRemaining(PIX_DEMO_DURATION_SECONDS);
  }, []);
  return { remaining, restart };
}
