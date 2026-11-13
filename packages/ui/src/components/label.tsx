"use client";

import { cn } from "@privana/ui/lib/utils";
import type * as React from "react";

function Label({
  className,
  htmlFor,
  children,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "flex select-none items-center gap-2 font-medium text-sm leading-5 peer-disabled:cursor-not-allowed peer-disabled:opacity-60 group-data-[disabled=true]:cursor-not-allowed group-data-[disabled=true]:opacity-60",
        className
      )}
      data-slot="label"
      htmlFor={htmlFor}
      {...props}
    >
      {children}
    </label>
  );
}

export { Label };
