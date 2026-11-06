const PLACEHOLDER =
  /replace[-_\s]?with|your[-_\s]?(?:database[-_\s]?)?(?:user|password|host|token|key)|change[-_\s]?me|^re_test_|^ci-only-|^example[-_]/i;
export function isPlaceholderValue(value: string): boolean {
  return PLACEHOLDER.test(value);
}
