import { createOwnerFrame } from "../owner/create-frame.mjs";
import { cmsAction } from "./action.mjs";
import { cmsFields, cmsTabOrder, cmsTabs } from "./fields.mjs";

export function createCmsCases(role) {
  const prefix = `cms-${role}`;
  const base = {
    ...createOwnerFrame(role, "cms"),
    cmsRole: role,
    notice:
      "Campos e prévia locais do KAR-184. Salvamento, publicação e proteção de versões são KAR-186 antes do G1. Coleções usam uma página e um link representativos, sem novo editor de layout ou fontes.",
    title: "Conteúdo e marca",
  };
  return [
    ...cmsTabOrder.flatMap((tab) =>
      [false, true].map((invalid) => ({
        ...base,
        actions: [
          cmsAction(role, "Prévia do rascunho", "preview", `${prefix}-preview`),
          { label: "Fechar edição", target: `owner-${role}-cms` },
        ],
        cards: [
          {
            text: [
              "A prévia não altera o conteúdo público.",
              ...(tab === "pages"
                ? [
                    "Uma página de exemplo; o CMS suporta até 20 páginas de texto.",
                  ]
                : []),
              ...(tab === "navigation"
                ? ["Um link de exemplo; o CMS suporta até 12 links de rodapé."]
                : []),
            ],
            title: "Revise antes de publicar",
          },
        ],
        cmsTab: tab,
        error: invalid,
        form: {
          fields: cmsFields[tab],
          group: prefix,
          layout: "cms-fields",
          legend: cmsTabs[tab],
          trackDirty: true,
        },
        id: `${prefix}-${tab}${invalid ? "-invalid" : ""}`,
        label: `${role} · CMS ${cmsTabs[tab]}${invalid ? " · validação" : ""}`,
        tab: cmsTabs[tab],
        tabs: cmsTabOrder.map((key) => ({
          icon: "studio",
          label: cmsTabs[key],
          target: `${prefix}-${key}`,
        })),
      }))
    ),
    {
      ...base,
      actions: [cmsAction(role, "Voltar ao rascunho", "open", "editor")],
      cards: [{ cmsPreview: role }],
      id: `${prefix}-preview`,
      label: `${role} · CMS prévia local`,
      title: "Revise seu rascunho",
    },
  ];
}
