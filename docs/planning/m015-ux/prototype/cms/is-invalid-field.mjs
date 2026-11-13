import { hasReadableAccent } from "./has-readable-accent.mjs";
import { isInvalidCmsList } from "./is-invalid-list.mjs";
import { isSafeCmsUrl } from "./is-safe-url.mjs";
export function isInvalidCmsField(field, value) {
  if (field.type === "checkbox") {
    return false;
  }
  const input = document.createElement("input");
  input.type = field.type === "email" ? "email" : "text";
  input.value = value;
  input.required = Boolean(field.required);
  if (field.pattern) {
    input.pattern = field.pattern;
  }
  return (
    !input.checkValidity() ||
    Boolean(field.max && value.length > field.max) ||
    isInvalidCmsList(field.format, value) ||
    (field.format === "url" && !isSafeCmsUrl(value)) ||
    (field.name === "accent" && !hasReadableAccent(value))
  );
}
