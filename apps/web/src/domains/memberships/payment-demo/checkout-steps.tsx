import { cn } from "@privana/ui/lib/utils";
import { Check } from "lucide-react";
import type { DemoStage } from "./demo-types";

const STEPS = ["Método e moeda", "Revisão", "Resultado"] as const;
const STEP_INDEX: Record<DemoStage, number> = {
  choose: 0,
  pix: 1,
  result: 2,
  review: 1,
};

export function CheckoutSteps({ stage }: { stage: DemoStage }) {
  const current = STEP_INDEX[stage];
  return (
    <ol
      aria-label="Etapas da demonstração"
      className="flex items-center gap-3 sm:gap-6"
    >
      {STEPS.map((label, index) => (
        <li
          aria-current={current === index ? "step" : undefined}
          className="flex min-w-0 items-center gap-2 text-xs sm:text-sm"
          key={label}
        >
          <span
            aria-hidden="true"
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full border font-medium",
              current === index
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground"
            )}
          >
            {index < current ? <Check className="size-3.5" /> : index + 1}
          </span>
          <span
            className={cn(
              "truncate",
              current === index
                ? "font-medium text-foreground"
                : "text-muted-foreground"
            )}
          >
            {label}
          </span>
        </li>
      ))}
    </ol>
  );
}
