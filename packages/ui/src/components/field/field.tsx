"use client";

import { Field as FieldPrimitive } from "@base-ui/react/field";
import { cn } from "@privana/ui/lib/utils";
import { useCallback } from "react";

export function Field({ className, ...props }: FieldPrimitive.Root.Props) {
  const resolveClassName = useCallback(
    (state: FieldPrimitive.Root.State) =>
      cn(
        "group/field flex min-w-0 flex-col gap-2",
        typeof className === "function" ? className(state) : className
      ),
    [className]
  );
  return (
    <FieldPrimitive.Root
      className={resolveClassName}
      data-slot="field"
      {...props}
    />
  );
}
