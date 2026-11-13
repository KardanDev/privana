import { createEditorCases } from "./create-editor-cases.mjs";
import { studioFrame } from "./model.mjs";

export const postListFrame = {
  ...studioFrame,
  cards: [
    {
      actions: [{ label: "Editar exemplo", target: "studio-edit" }],
      text: ["Rascunho · somente você vê este exemplo"],
      title: "Ensaio de domingo",
    },
  ],
  form: {
    fields: [
      {
        casePrefix: "studio-list-",
        label: "Mostrar",
        name: "status",
        options: [
          { label: "Todas as ativas", value: "active" },
          { label: "Rascunhos", value: "draft" },
          { label: "Publicadas", value: "published" },
          { label: "Arquivadas", value: "archived" },
        ],
        type: "select",
        value: "active",
      },
    ],
    group: "studio-filter",
    legend: "Seu conteúdo",
  },
  layout: "rows",
  topActions: [
    {
      guardGroup: "post-new",
      guardTarget: "studio-new-leave",
      label: "Nova publicação",
      resetGroup: "post-new",
      target: "studio-new",
    },
  ],
};
export const contentScenarios = [
  ...["new", "edit"].flatMap(createEditorCases),
  ...[
    ["active", "Rascunho", "ativas"],
    ["draft", "Rascunho", "rascunhos"],
    ["published", "Publicada", "publicadas"],
    ["archived", "Arquivada", "arquivadas"],
  ].map(([status, label, filterLabel]) => ({
    ...postListFrame,
    cards: [
      {
        actions: [{ label: "Editar exemplo", target: "studio-edit" }],
        text: [`${label} · exemplo independente`],
        title: "Ensaio de domingo",
      },
    ],
    form: {
      ...postListFrame.form,
      fields: [{ ...postListFrame.form.fields[0], value: status }],
    },
    id: `studio-list-${status}`,
    label: `Studio · filtro ${filterLabel}`,
  })),
  {
    ...studioFrame,
    cards: [
      {
        text: [
          "Crie sua primeira publicação. Rascunhos ficam separados do conteúdo publicado.",
        ],
        title: "Seu conteúdo começa aqui",
      },
    ],
    id: "studio-empty",
    label: "Studio · primeira publicação",
    topActions: postListFrame.topActions,
  },
  {
    ...postListFrame,
    actions: [{ label: "Trocar filtro", target: "studio-list-active" }],
    cards: [
      {
        text: ["Escolha outro estado para encontrar seu conteúdo."],
        title: "Nenhuma publicação neste filtro",
      },
    ],
    form: {
      ...postListFrame.form,
      fields: [{ ...postListFrame.form.fields[0], value: "published" }],
    },
    id: "studio-filter-empty",
    label: "Studio · filtro vazio",
  },
  {
    ...studioFrame,
    actions: [{ disabled: true, label: "Carregando…" }],
    feedback: "Buscando suas publicações…",
    id: "studio-list-loading",
    label: "Studio · lista carregando",
    outcomes: [
      { label: "Concluir lista", target: "studio-list-active" },
      { label: "Simular falha da lista", target: "studio-list-failed" },
    ],
  },
  {
    ...studioFrame,
    actions: [
      { label: "Tentar carregar novamente", target: "studio-list-loading" },
    ],
    error: true,
    feedback: "Não foi possível carregar seu conteúdo. Tente novamente.",
    id: "studio-list-failed",
    label: "Studio · lista falhou",
  },
];
