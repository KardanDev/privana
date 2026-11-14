import { cn } from "@privana/ui/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-lg bg-muted motion-reduce:animate-none",
        className
      )}
      data-slot="skeleton"
      {...props}
    />
  );
}

export { Skeleton };
