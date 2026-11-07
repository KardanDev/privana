/** @type {{ current: string, fields: Map<string, string | boolean>, scroll: Map<string, number>, dirtyGroups: Set<string>, leaveTargets: Map<string, string> }} */
export const reviewState = {
  current: location.hash.slice(1),
  dirtyGroups: new Set(),
  fields: new Map(),
  leaveTargets: new Map(),
  scroll: new Map(),
};
