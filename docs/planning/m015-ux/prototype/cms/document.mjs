import { cmsFields } from "./fields.mjs";

const documents = new Map();
export function getCmsDocument(role) {
  if (!documents.has(role)) {
    const saved = Object.fromEntries(
      Object.values(cmsFields)
        .flat()
        .map((field) => [field.name, field.value])
    );
    documents.set(role, {
      expected: 2,
      history: new Map([[2, { ...saved }]]),
      published: { ...saved },
      publishedVersion: 2,
      saved,
      serverVersion: 2,
      tab: "brand",
      version: 2,
    });
  }
  return documents.get(role);
}
