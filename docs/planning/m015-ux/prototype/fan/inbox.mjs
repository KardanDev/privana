import { fanFrame } from "./model.mjs";

const conversation = {
  actions: [{ label: "Abrir conversa", target: "fan-inbox" }],
  text: ["Obrigada por acompanhar meu trabalho!"],
  title: "Isabela Ferreira",
};
const inbox = {
  ...fanFrame,
  actions: [
    {
      label: "Enviar mensagem",
      target: "fan-message-pending",
      validates: true,
    },
    { label: "Todas as conversas", target: "fan-inbox-list" },
  ],
  active: "Mensagens",
  cards: [
    { text: ["Obrigada por acompanhar meu trabalho!"], title: "Isabela" },
  ],
  form: {
    fields: [
      {
        label: "Sua mensagem",
        max: 5000,
        name: "message",
        required: true,
        value: "Olá, Isabela! Adorei o último ensaio.",
      },
    ],
    group: "inbox",
    legend: "Escreva para Isabela",
  },
  formPlacement: "after",
  intro: "Conversa fictícia; somente os participantes têm acesso no produto.",
  layout: "conversation",
  route: "/messages?conversation=exemplo",
  secondary: { cards: [conversation], title: "Suas conversas" },
  title: "Isabela Ferreira",
};
export const inboxScenarios = [
  { ...inbox, id: "fan-inbox", label: "Fã · conversa" },
  {
    ...inbox,
    actions: [{ disabled: true, label: "Enviando…" }],
    feedback: "Enviando mensagem…",
    form: {
      ...inbox.form,
      fields: inbox.form.fields.map((field) => ({ ...field, disabled: true })),
    },
    id: "fan-message-pending",
    label: "Fã · enviando",
    outcomes: [
      { label: "Confirmar envio de exemplo", target: "fan-message-sent" },
      { label: "Simular falha", target: "fan-message-failed" },
    ],
  },
  {
    ...inbox,
    error: true,
    feedback:
      "A mensagem não foi enviada. Seu texto continua aqui para tentar novamente.",
    focusField: "message",
    id: "fan-message-failed",
    label: "Fã · mensagem falhou",
  },
  {
    ...inbox,
    actions: [{ label: "Voltar às conversas", target: "fan-inbox-list" }],
    cards: [
      {
        text: [{ fallback: inbox.form.fields[0].value, from: "inbox:message" }],
        title: "Você · exemplo confirmado",
      },
    ],
    feedback: "Envio confirmado apenas neste exemplo.",
    form: null,
    id: "fan-message-sent",
    label: "Fã · mensagem confirmada",
  },
  {
    ...fanFrame,
    active: "Mensagens",
    cards: [conversation],
    id: "fan-inbox-list",
    label: "Fã · lista de conversas",
    route: "/messages",
    title: "Mensagens",
  },
  {
    ...fanFrame,
    actions: [{ label: "Explorar criadores", target: "fan-discover-member" }],
    active: "Mensagens",
    cards: [
      {
        text: [
          "Comece pelo perfil de um criador quando as mensagens estiverem disponíveis.",
        ],
        title: "Suas conversas aparecem aqui",
      },
    ],
    id: "fan-inbox-empty",
    label: "Fã · nenhuma conversa",
    route: "/messages",
    title: "Mensagens",
  },
  {
    ...fanFrame,
    actions: [{ label: "Voltar ao feed", target: "fan-feed" }],
    feedback: "As mensagens estão desativadas neste exemplo de configuração.",
    id: "fan-inbox-off",
    label: "Fã · mensagens desativadas",
    mobileNavigation: fanFrame.mobileNavigation.filter(
      (item) => item.label !== "Mensagens"
    ),
    navigation: fanFrame.navigation.filter(
      (item) => item.label !== "Mensagens"
    ),
    route: "/messages",
    title: "Mensagens indisponíveis",
  },
];
