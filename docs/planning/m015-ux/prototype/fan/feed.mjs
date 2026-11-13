import { feedTabs } from "./feed-tabs.mjs";
import { fanFrame, memberCreators } from "./model.mjs";
import { publicPost } from "./post.mjs";

const feed = {
  ...fanFrame,
  actions: [{ label: "Salvar publicação", target: "fan-saving" }],
  active: "Início",
  cards: [publicPost],
  intro: "Publicações de quem você escolhe acompanhar.",
  layout: "feed",
  route: "/feed",
  secondary: { cards: memberCreators.slice(1), title: "Conheça também" },
  tab: "Seguindo",
  tabs: feedTabs,
  title: "Seu feed",
};
export const feedScenarios = [
  { ...feed, id: "fan-feed", label: "Fã · seguindo" },
  {
    ...feed,
    actions: [{ disabled: true, label: "Carregando…" }],
    cards: [
      {
        text: ["Seu conteúdo aparecerá aqui em instantes."],
        title: "Buscando publicações…",
      },
    ],
    id: "fan-feed-loading",
    label: "Fã · carregando",
    outcomes: [
      { label: "Concluir carregamento", target: "fan-feed" },
      { label: "Simular falha", target: "fan-feed-failed" },
    ],
  },
  {
    ...feed,
    actions: [{ label: "Tentar novamente", target: "fan-feed-loading" }],
    cards: [],
    error: true,
    feedback: "Não foi possível carregar as publicações. Tente novamente.",
    id: "fan-feed-failed",
    label: "Fã · falha ao carregar",
  },
  {
    ...feed,
    actions: [{ disabled: true, label: "Salvando…" }],
    feedback: "Salvando publicação…",
    id: "fan-saving",
    label: "Fã · salvando",
    outcomes: [
      { label: "Confirmar salvo", target: "fan-save-confirmed" },
      { label: "Simular falha", target: "fan-save-failed" },
    ],
    preserveScroll: true,
  },
  {
    ...feed,
    actions: [{ label: "Ver salvos", target: "fan-saved" }],
    feedback: "Publicação salva.",
    id: "fan-save-confirmed",
    label: "Fã · salvo",
    preserveScroll: true,
  },
  {
    ...feed,
    actions: [{ label: "Tentar salvar novamente", target: "fan-saving" }],
    error: true,
    feedback:
      "Não foi possível salvar. A publicação continua aqui para tentar novamente.",
    id: "fan-save-failed",
    label: "Fã · falha ao salvar",
    preserveScroll: true,
  },
  {
    ...fanFrame,
    actions: [{ label: "Remover dos salvos", target: "fan-saved-empty" }],
    active: "Salvos",
    cards: [publicPost],
    id: "fan-saved",
    label: "Fã · salvos",
    route: "/saved",
    title: "Suas publicações salvas",
  },
  {
    ...fanFrame,
    actions: [{ label: "Voltar ao feed", target: "fan-feed" }],
    active: "Salvos",
    cards: [
      {
        text: [
          "As publicações que você salvar aparecem aqui. Salvar não libera conteúdo restrito.",
        ],
        title: "Guarde o que quer rever",
      },
    ],
    id: "fan-saved-empty",
    label: "Fã · salvos vazios",
    route: "/saved",
    title: "Salvos",
  },
];
