"use client";

import { type MouseEvent, useCallback, useState } from "react";

export function useCmsTabs() {
  const [tab, setTab] = useState("brand");
  const select = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => setTab(event.currentTarget.value),
    []
  );
  return { select, tab };
}
