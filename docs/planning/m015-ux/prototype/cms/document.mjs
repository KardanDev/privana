import { cmsFields } from "./fields.mjs";

const documents = new Map();
export function getCmsDocument(role) {
  if (!documents.has(role)) {
    documents.set(role, {
      saved: Object.fromEntries(
        Object.values(cmsFields)
          .flat()
          .map((field) => [field.name, field.value])
      ),
      tab: "brand",
    });
  }
  return documents.get(role);
}
