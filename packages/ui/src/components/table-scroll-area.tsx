import { cn } from "@privana/ui/lib/utils";
import type { ComponentProps } from "react";

export function TableScrollArea({
  label,
  className,
  ...props
}: ComponentProps<"section"> & { label: string }) {
  return (
    <section
      aria-label={label}
      className={cn(
        "min-w-0 overflow-x-auto rounded-table border bg-card outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_tbody_tr>:first-child]:text-base [&_thead]:bg-muted [&_thead_th]:text-sm",
        className
      )}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: The named scroll region needs a keyboard target for horizontal table scrolling.
      tabIndex={0}
      {...props}
    />
  );
}
