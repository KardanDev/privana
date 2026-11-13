"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { cn } from "@privana/ui/lib/utils";
import { CheckIcon, MinusIcon } from "lucide-react";

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "peer group/checkbox relative flex size-11 shrink-0 items-center justify-center rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 sm:size-5",
        className
      )}
      data-slot="checkbox"
      {...props}
    >
      <span className="grid size-5 place-content-center rounded-md border border-input bg-card text-primary-foreground group-aria-invalid/checkbox:border-destructive group-aria-invalid/checkbox:ring-1 group-aria-invalid/checkbox:ring-destructive group-data-checked/checkbox:border-primary group-data-indeterminate/checkbox:border-primary group-data-checked/checkbox:bg-primary group-data-indeterminate/checkbox:bg-primary">
        <CheckboxPrimitive.Indicator
          className="grid place-content-center [&>svg]:size-3.5"
          data-slot="checkbox-indicator"
        >
          <CheckIcon className="group-data-indeterminate/checkbox:hidden" />
          <MinusIcon className="hidden group-data-indeterminate/checkbox:block" />
        </CheckboxPrimitive.Indicator>
      </span>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
