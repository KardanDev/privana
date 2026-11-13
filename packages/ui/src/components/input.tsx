import { Input as InputPrimitive } from "@base-ui/react/input";
import { fieldControlStyles } from "@privana/ui/lib/field-control-styles";
import { cn } from "@privana/ui/lib/utils";
import type * as React from "react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      className={cn(
        fieldControlStyles,
        "h-11 py-2 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm",
        className
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}

export { Input };
