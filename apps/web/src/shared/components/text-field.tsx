import { Input } from "@privana/ui/components/input";
import { Label } from "@privana/ui/components/label";
import type { ComponentProps } from "react";
export function TextField({
  label,
  hint,
  ...props
}: ComponentProps<"input"> & { label: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={props.id ?? props.name}>{label}</Label>
      <Input
        {...props}
        aria-describedby={hint ? `${props.name}-hint` : undefined}
        id={props.id ?? props.name}
      />
      {hint ? (
        <p
          className="text-muted-foreground text-xs leading-relaxed"
          id={`${props.name}-hint`}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
