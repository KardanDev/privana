"use client";

import type { useRouter } from "next/navigation";
import { createContext, type RefObject } from "react";

export type NavigationGuard = (
  destination: URL,
  proceed: () => void,
  restoreFocus: () => void
) => boolean;

export const NavigationGuardContext = createContext<{
  guard: RefObject<NavigationGuard | null>;
  router: ReturnType<typeof useRouter>;
} | null>(null);
