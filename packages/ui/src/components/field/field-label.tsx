"use client";

import { Field as FieldPrimitive } from "@base-ui/react/field";
import { Label } from "@privana/ui/components/label";

export function FieldLabel(props: FieldPrimitive.Label.Props) {
  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      render={<Label />}
      {...props}
    />
  );
}
