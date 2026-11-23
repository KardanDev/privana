"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useRef } from "react";
import {
  type NavigationGuard,
  NavigationGuardContext,
} from "./navigation-guard-context";

export function NavigationGuardProvider({ children }: { children: ReactNode }) {
  const guard = useRef<NavigationGuard | null>(null);
  const router = useRouter();
  return (
    <NavigationGuardContext value={{ guard, router }}>
      {children}
    </NavigationGuardContext>
  );
}
