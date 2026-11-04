import { Input } from "@privana/ui/components/input";
import { Label } from "@privana/ui/components/label";

export function AuthField({
  name,
  label,
  type = "text",
  autoComplete,
  minLength,
}: {
  name: string;
  label: string;
  type?: string;
  autoComplete: string;
  minLength?: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={`auth-${name}`}>{label}</Label>
      <Input
        autoComplete={autoComplete}
        className="h-12 rounded-xl"
        id={`auth-${name}`}
        maxLength={type === "password" ? 128 : 254}
        minLength={minLength}
        name={name}
        required
        type={type}
      />
    </div>
  );
}
