import { fanFrame, publicFrame } from "../fan/model.mjs";
import { profileFields, studioFrame } from "./model.mjs";

export function createProfileCases(kind) {
  const group = `creator-profile-${kind}`;
  const id = `studio-profile-${kind}`;
  const active = kind === "active";
  const caseLabel = {
    active: "ativo",
    apply: "candidatura",
    pending: "em análise",
  }[kind];
  const form = {
    fields: profileFields,
    group,
    layout: "profile",
    legend: "Perfil de criador",
    trackDirty: true,
  };
  const frame = {
    ...(active ? studioFrame : fanFrame),
    actions: [
      {
        label: kind === "apply" ? "Enviar candidatura" : "Salvar alterações",
        target: `${id}-saving`,
        validates: true,
      },
      {
        guardGroup: group,
        guardTarget: `${id}-leave`,
        label: "Fechar edição",
        target: active ? "studio-overview" : "fan-account",
      },
    ],
    feedback:
      kind === "pending"
        ? "Perfil em análise. Você pode atualizar os dados enquanto aguarda; a publicação continua indisponível."
        : undefined,
    form,
    guardGroup: group,
    guardTarget: `${id}-leave`,
    intro:
      kind === "apply"
        ? "Envie sua candidatura para análise da equipe."
        : "Edite o perfil público. Os dados da conta ficam em Configurações.",
    route: "/studio",
    tab: "Editar perfil",
    title: active ? "Perfil de criador" : "Minha candidatura",
  };
  return [
    { ...frame, id, label: `Studio · perfil ${caseLabel}` },
    {
      ...frame,
      actions: [{ disabled: true, label: "Salvando perfil…" }],
      form: {
        ...form,
        fields: profileFields.map((field) => ({ ...field, disabled: true })),
      },
      id: `${id}-saving`,
      label: `Studio · salvando perfil ${caseLabel}`,
      outcomes: [
        { label: "Confirmar perfil de exemplo", target: `${id}-saved` },
        { label: "Simular falha de perfil", target: `${id}-failed` },
      ],
    },
    {
      ...frame,
      error: true,
      feedback:
        "Não foi possível salvar. Suas alterações continuam no formulário.",
      focusField: "displayName",
      id: `${id}-failed`,
      label: `Studio · falha de perfil ${caseLabel}`,
    },
    {
      ...frame,
      actions: [
        {
          label: active ? "Continuar no Studio" : "Revisar candidatura",
          target: active ? "studio-overview" : "studio-profile-pending",
        },
        ...(active
          ? [{ label: "Ver prévia local do perfil", target: `${id}-preview` }]
          : []),
      ],
      cards: [],
      feedback: active
        ? "Perfil confirmado neste exemplo."
        : "Candidatura recebida · em análise. Ainda não é possível publicar; isto não verifica idade ou identidade.",
      form: null,
      guardGroup: null,
      id: `${id}-saved`,
      intro: active ? frame.intro : "Seu perfil de criador está em análise.",
      label: `Studio · perfil confirmado ${caseLabel}`,
      savedGroup: group,
      title: active ? frame.title : "Candidatura em análise",
    },
    {
      ...(active ? studioFrame : fanFrame),
      actions: [
        { label: "Continuar editando", target: id },
        {
          label: "Descartar alterações",
          resetGroup: group,
          resume: true,
          target: "studio-overview",
        },
      ],
      cards: [
        {
          text: [
            "Continue para manter os dados ou descarte para retornar ao destino escolhido.",
          ],
          title: "Descartar alterações do perfil?",
        },
      ],
      id: `${id}-leave`,
      label: `Studio · sair do perfil ${caseLabel}`,
      route: "/studio",
      title: "Alterações do perfil",
    },
    {
      ...publicFrame,
      actions: [{ label: "Voltar à edição", target: id }],
      cards: [
        {
          text: [
            { fallback: profileFields[2].value, from: `${group}:bio` },
            { fallback: "São Paulo, Brasil", from: `${group}:location` },
          ],
          title: "Sobre o perfil",
        },
      ],
      id: `${id}-preview`,
      intro:
        "Prévia local não publicada; imagens não são buscadas a partir dos campos.",
      label: `Studio · prévia de perfil ${caseLabel}`,
      route: {
        fallback: "isabela-demo",
        from: `${group}:handle`,
        prefix: "/creators/",
      },
      title: { fallback: "Isabela Ferreira", from: `${group}:displayName` },
    },
  ];
}
