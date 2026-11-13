import { Field } from "@privana/ui/components/field/field";
import { FieldDescription } from "@privana/ui/components/field/field-description";
import { FieldError } from "@privana/ui/components/field/field-error";
import { FieldLabel } from "@privana/ui/components/field/field-label";
import { Input } from "@privana/ui/components/input";
import type { ComponentProps } from "react";
export function TextField({
  label,
  hint,
  error,
  ...props
}: ComponentProps<"input"> & { label: string; hint?: string; error?: string }) {
  return (
    <Field
      disabled={props.disabled}
      invalid={error ? true : undefined}
      name={props.name}
    >
      <FieldLabel>{label}</FieldLabel>
      <Input {...props} aria-invalid={error ? true : props["aria-invalid"]} />
      {hint ? <FieldDescription>{hint}</FieldDescription> : null}
      {error ? <FieldError match>{error}</FieldError> : null}
    </Field>
  );
}
