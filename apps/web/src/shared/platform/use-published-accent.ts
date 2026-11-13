"use client";

import { useEffect } from "react";

export function usePublishedAccent(accent: string): void {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.getPropertyValue("--brand-accent");
    root.style.setProperty("--brand-accent", accent);

    return () => {
      if (root.style.getPropertyValue("--brand-accent") !== accent) {
        return;
      }
      if (previous) {
        root.style.setProperty("--brand-accent", previous);
      } else {
        root.style.removeProperty("--brand-accent");
      }
    };
  }, [accent]);
}
