import { Textarea } from "@privana/ui/components/textarea";

export function CmsTextarea({
  label,
  name,
  value,
  maximum = 500,
  hint,
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  maximum?: number;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm" htmlFor={name}>
      {label}
      <Textarea
        defaultValue={value}
        id={name}
        maxLength={maximum}
        name={name}
        required={required}
        rows={4}
      />
      {hint ? (
        <span className="text-muted-foreground text-xs">{hint}</span>
      ) : null}
    </label>
  );
}
