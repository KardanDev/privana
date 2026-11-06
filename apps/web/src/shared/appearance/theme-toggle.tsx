"use client";

import { Button } from "@privana/ui/components/button";
import { Moon, Sun } from "lucide-react";
import { useToggleTheme } from "./use-toggle-theme";

export function ThemeToggle() {
  const toggle = useToggleTheme();
  return (
    <Button
      aria-label="Alternar tema claro ou escuro"
      onClick={toggle}
      size="icon"
      title="Alternar tema claro ou escuro"
      variant="ghost"
    >
      <Moon aria-hidden="true" className="dark:hidden" />
      <Sun aria-hidden="true" className="hidden dark:block" />
    </Button>
  );
}
