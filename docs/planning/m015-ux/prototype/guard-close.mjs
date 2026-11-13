import { guardDestination } from "./guard-destination.mjs";

export function guardClose(event) {
  const link = event.currentTarget;
  if (
    guardDestination(
      link.dataset.guardGroup,
      link.hash.slice(1),
      link.dataset.guardTarget
    )
  ) {
    event.preventDefault();
  }
}
