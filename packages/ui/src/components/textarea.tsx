import { fieldControlStyles } from "@privana/ui/lib/field-control-styles";
import { cn } from "@privana/ui/lib/utils";
import type * as React from "react";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        fieldControlStyles,
        "field-sizing-content flex min-h-24 resize-y py-3",
        className
      )}
      data-slot="textarea"
      {...props}
    />
  );
}

export { Textarea };
