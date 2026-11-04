"use client";

import { useCallback, useState } from "react";

export function useReportExpansion() {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((current) => !current), []);
  return { open, toggle };
}
