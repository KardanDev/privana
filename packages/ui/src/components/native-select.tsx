import { fieldControlStyles } from "@privana/ui/lib/field-control-styles";
import { cn } from "@privana/ui/lib/utils";
import type { ComponentProps } from "react";

export function NativeSelect({
  className,
  ...props
}: ComponentProps<"select">) {
  return (
    <select
      className={cn(fieldControlStyles, "h-11 py-2", className)}
      data-slot="native-select"
      {...props}
    />
  );
}
