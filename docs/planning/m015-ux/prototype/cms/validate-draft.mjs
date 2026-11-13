import { cmsFields } from "./fields.mjs";
import { isInvalidCmsField } from "./is-invalid-field.mjs";

export function validateCmsDraft(draft) {
  for (const [tab, fields] of Object.entries(cmsFields)) {
    for (const field of fields) {
      const value = String(draft[field.name]).trim();
      if (isInvalidCmsField(field, value)) {
        return {
          field: field.name,
          message: `Revise “${field.label}”. Confira o formato, o limite e as orientações do campo.`,
          tab,
        };
      }
    }
  }
  if (Boolean(draft.linkLabel.trim()) !== Boolean(draft.linkHref.trim())) {
    return {
      field: "linkLabel",
      message: "Preencha o texto e o destino do link, ou deixe ambos vazios.",
      tab: "navigation",
    };
  }
  if (
    [draft.slug, draft.pageTitle, draft.pageBody].some((value) =>
      value.trim()
    ) &&
    [draft.slug, draft.pageTitle, draft.pageBody].some((value) => !value.trim())
  ) {
    return {
      field: "slug",
      message:
        "Preencha endereço, título e conteúdo da página, ou deixe os três vazios.",
      tab: "pages",
    };
  }
}
