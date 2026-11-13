export function cmsAction(role, label, command, target) {
  return {
    cms: { command, role },
    label,
    primary: command === "preview",
    target,
  };
}
