/** @type {{ current: string, fields: Map<string, string | boolean>, scroll: Map<string, number> }} */
export const reviewState = {
  current: location.hash.slice(1),
  fields: new Map(),
  scroll: new Map(),
};
