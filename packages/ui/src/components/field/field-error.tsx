"use client";

import { Field as FieldPrimitive } from "@base-ui/react/field";
import { cn } from "@privana/ui/lib/utils";
import { useCallback } from "react";

export function FieldError({
  className,
  ...props
}: FieldPrimitive.Error.Props) {
  const resolveClassName = useCallback(
    (state: FieldPrimitive.Error.State) =>
      cn(
        "text-destructive text-sm leading-5",
        typeof className === "function" ? className(state) : className
      ),
    [className]
  );
  return (
    <FieldPrimitive.Error
      className={resolveClassName}
      data-slot="field-error"
      {...props}
    />
  );
}
