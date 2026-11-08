import { studioFrame } from "./model.mjs";
import { postFields } from "./post-fields.mjs";

export function createEditorCases(kind) {
  const id = `studio-${kind}`;
  const caseLabel = kind === "new" ? "nova publicação" : "edição";
  const group = `post-${kind}`;
  const form = {
    fields: postFields,
    group,
    legend: "Conteúdo da publicação",
    trackDirty: true,
  };
  const title = { fallback: postFields[0].value, from: `${group}:title` };
  const frame = {
    ...studioFrame,
    actions: [
      {
        label: "Salvar rascunho",
        primary: false,
        target: `${id}-saving`,
        validates: true,
      },
      {
        label: "Publicar",
        primary: true,
        target: `${id}-publishing`,
        validates: true,
      },
      { label: "Revisar prévia", target: `${id}-preview`, validates: true },
      { label: "Usar mídia de exemplo", target: `${id}-uploading` },
      {
        guardGroup: group,
        guardTarget: `${id}-leave`,
        label: "Fechar editor",
        target: "studio-list-draft",
      },
    ],
    form,
    guardGroup: group,
    guardTarget: `${id}-leave`,
    title:
      kind === "new"
        ? {
            fallback: "Nova publicação",
            from: `${group}:record-status`,
            labels: {
              Arquivada: "Editar publicação",
              Publicada: "Editar publicação",
              Rascunho: "Editar publicação",
            },
          }
        : "Editar publicação",
  };
  const pending = {
    ...frame,
    actions: [{ disabled: true, label: "Salvando…" }],
    form: {
      ...form,
      fields: postFields.map((field) => ({ ...field, disabled: true })),
    },
  };
  const result = {
    ...studioFrame,
    cards: [
      {
        text: [{ fallback: postFields[1].value, from: `${group}:excerpt` }],
        title,
      },
    ],
    savedGroup: group,
  };
  return [
    { ...frame, id, label: `Studio · editor ${caseLabel}` },
    {
      ...studioFrame,
      actions: [{ label: "Voltar ao editor", target: id }],
      cards: [
        {
          text: [
            {
              fallback: postFields[1].value,
              from: `${group}:excerpt`,
              prefix: "Prévia pública: ",
            },
          ],
          title,
        },
        {
          text: [
            {
              fallback: "SUBSCRIBERS",
              from: `${group}:visibility`,
              labels: { PUBLIC: "Todos", SUBSCRIBERS: "Somente assinantes" },
              prefix: "Visibilidade: ",
            },
            { fallback: postFields[2].value, from: `${group}:body` },
            {
              fallback: "Nenhum arquivo anexado",
              from: `${group}:media`,
              prefix: "Mídia do conteúdo: ",
            },
          ],
          title: "Revisão no Studio",
        },
      ],
      guardGroup: group,
      guardTarget: `${id}-leave`,
      id: `${id}-preview`,
      intro:
        "O resumo público é separado do texto e da mídia de conteúdo, entregues conforme a visibilidade.",
      label: `Studio · prévia ${caseLabel}`,
      title: "Revise sua publicação",
    },
    {
      ...pending,
      feedback: "Salvando rascunho…",
      id: `${id}-saving`,
      label: `Studio · salvando ${caseLabel}`,
      outcomes: [
        { label: "Confirmar rascunho", target: `${id}-draft` },
        { label: "Simular falha ao salvar", target: `${id}-failed` },
      ],
    },
    {
      ...pending,
      feedback: "Publicando…",
      id: `${id}-publishing`,
      label: `Studio · publicando ${caseLabel}`,
      outcomes: [
        { label: "Confirmar publicação", target: `${id}-published` },
        { label: "Simular falha ao publicar", target: `${id}-failed` },
      ],
    },
    {
      ...frame,
      error: true,
      feedback:
        "Não foi possível salvar. Seu texto e as escolhas continuam aqui.",
      focusField: "title",
      id: `${id}-failed`,
      label: `Studio · falha de edição ${caseLabel}`,
    },
    {
      ...pending,
      dirtyGroup: group,
      feedback: "Anexando arquivo de exemplo…",
      fieldValues: {
        [`${group}:media`]: "ensaio-exemplo.webp · 2 MB · aguardando envio",
      },
      id: `${id}-uploading`,
      label: `Studio · enviando mídia ${caseLabel}`,
      outcomes: [
        { label: "Confirmar anexo de exemplo", target: `${id}-uploaded` },
        { label: "Simular falha de upload", target: `${id}-upload-failed` },
      ],
    },
    {
      ...frame,
      actions: [
        { label: "Tentar mídia novamente", target: `${id}-uploading` },
        { label: "Continuar sem mídia", target: `${id}-upload-removed` },
        {
          guardGroup: group,
          guardTarget: `${id}-leave`,
          label: "Fechar editor",
          target: "studio-list-draft",
        },
      ],
      dirtyGroup: group,
      error: true,
      feedback:
        "O arquivo não foi enviado. Seu texto foi mantido; tente usar a mídia de exemplo novamente.",
      fieldValues: { [`${group}:media`]: "ensaio-exemplo.webp · não anexado" },
      id: `${id}-upload-failed`,
      label: `Studio · upload falhou ${caseLabel}`,
    },
    {
      ...frame,
      dirtyGroup: group,
      feedback:
        "Mídia de exemplo pronta. A prévia pública continua separada da mídia de conteúdo.",
      fieldValues: {
        [`${group}:media`]: "ensaio-exemplo.webp · 2 MB · anexo pronto",
      },
      id: `${id}-uploaded`,
      label: `Studio · anexo pronto ${caseLabel}`,
    },
    {
      ...frame,
      feedback: "Você está continuando sem arquivo. Seu texto foi mantido.",
      fieldValues: { [`${group}:media`]: "Nenhum arquivo anexado" },
      id: `${id}-upload-removed`,
      label: `Studio · sem mídia ${caseLabel}`,
    },
    {
      ...studioFrame,
      actions: [
        { label: "Continuar editando", target: id },
        {
          label: "Descartar alterações",
          resetGroup: group,
          resume: true,
          target: "studio-list-draft",
        },
      ],
      cards: [],
      feedback:
        "Continuar mantém seu texto. Descartar remove apenas as alterações deste exemplo local.",
      id: `${id}-leave`,
      intro: "Escolha se quer manter o texto antes de sair do editor.",
      label: `Studio · sair do editor ${caseLabel}`,
      tabs: undefined,
      title: "Descartar suas alterações?",
    },
    {
      ...result,
      actions: [
        { label: "Editar rascunho", target: id },
        { label: "Voltar às publicações", target: `${id}-list` },
      ],
      feedback: "Rascunho confirmado neste exemplo. Não está publicado.",
      fieldValues: { [`${group}:record-status`]: "Rascunho" },
      id: `${id}-draft`,
      label: `Studio · rascunho ${caseLabel}`,
    },
    {
      ...result,
      actions: [
        { label: "Editar publicação", target: id },
        { label: "Arquivar publicação", target: `${id}-archive-review` },
      ],
      feedback:
        "Publicação confirmada neste exemplo. Nenhuma publicação real foi criada.",
      fieldValues: { [`${group}:record-status`]: "Publicada" },
      id: `${id}-published`,
      label: `Studio · publicada ${caseLabel}`,
    },
    {
      ...result,
      actions: [
        { label: "Confirmar arquivamento", target: `${id}-archiving` },
        { label: "Manter publicação", target: `${id}-published` },
      ],
      feedback:
        "Arquivar retira a publicação da exibição pública. Não exclui o registro.",
      id: `${id}-archive-review`,
      label: `Studio · revisar arquivo ${caseLabel}`,
      title: "Arquivar esta publicação?",
    },
    {
      ...result,
      actions: [{ disabled: true, label: "Arquivando…" }],
      id: `${id}-archiving`,
      label: `Studio · arquivando ${caseLabel}`,
      outcomes: [
        { label: "Confirmar arquivo", target: `${id}-archived` },
        { label: "Simular falha de arquivo", target: `${id}-archive-failed` },
      ],
    },
    {
      ...result,
      actions: [
        { label: "Tentar arquivar novamente", target: `${id}-archiving` },
        { label: "Voltar à publicação", target: `${id}-published` },
      ],
      error: true,
      feedback:
        "Não foi possível arquivar. A publicação continua no estado anterior.",
      id: `${id}-archive-failed`,
      label: `Studio · arquivo falhou ${caseLabel}`,
    },
    {
      ...result,
      actions: [{ label: "Ver publicação arquivada", target: `${id}-list` }],
      feedback: "Publicação arquivada neste exemplo, sem exclusão definitiva.",
      fieldValues: { [`${group}:record-status`]: "Arquivada" },
      id: `${id}-archived`,
      label: `Studio · arquivada ${caseLabel}`,
    },
    {
      ...studioFrame,
      actions: [{ label: "Voltar ao Studio", target: "studio-overview" }],
      cards: [
        {
          text: [
            {
              fallback: "Rascunho",
              from: `${group}:record-status`,
              prefix: "Estado do exemplo: ",
            },
          ],
          title,
        },
      ],
      id: `${id}-list`,
      label: `Studio · registro ${caseLabel}`,
      layout: "rows",
      title: "Suas publicações",
    },
  ];
}
