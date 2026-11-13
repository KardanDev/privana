export function cmsAction(role, label, command, target, clean = false) {
  return {
    cms: { clean, command, role },
    label,
    primary: ["save", "publish", "restore"].includes(command),
    target,
  };
}
