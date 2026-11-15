interface ToggleState {
  active: boolean;
  count: number;
}

export function isUnchangedSocialToggle(
  current: ToggleState,
  previous: ToggleState,
  active: boolean
): boolean {
  const count = Math.max(
    0,
    previous.count + Number(active) - Number(previous.active)
  );
  return current.active === active && current.count === count;
}
