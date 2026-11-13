import { guardDestination } from "./guard-destination.mjs";

export function changeCase(event) {
  const select = event.currentTarget;
  const target = `${select.dataset.prefix}${select.value}`;
  if (
    !guardDestination(
      select.dataset.guardGroup,
      target,
      select.dataset.guardTarget
    )
  ) {
    location.hash = target;
  }
}
