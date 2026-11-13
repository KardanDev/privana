import { reviewState } from "../state.mjs";
import { getCmsDocument } from "./document.mjs";

export function readCmsDraft(role) {
  const document = getCmsDocument(role);
  return Object.fromEntries(
    Object.entries(document.saved).map(([name, value]) => [
      name,
      reviewState.fields.get(`cms-${role}:${name}`) ?? value,
    ])
  );
}
