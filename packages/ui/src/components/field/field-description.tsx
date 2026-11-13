"use client";

import { Field as FieldPrimitive } from "@base-ui/react/field";
import { cn } from "@privana/ui/lib/utils";
import { useCallback } from "react";

export function FieldDescription({
  className,
  ...props
}: FieldPrimitive.Description.Props) {
  const resolveClassName = useCallback(
    (state: FieldPrimitive.Description.State) =>
      cn(
        "text-muted-foreground text-sm leading-5",
        typeof className === "function" ? className(state) : className
      ),
    [className]
  );
  return (
    <FieldPrimitive.Description
      className={resolveClassName}
      data-slot="field-description"
      {...props}
    />
  );
}
