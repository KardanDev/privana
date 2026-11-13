import { feedTabs } from "./feed-tabs.mjs";
import { fanFrame, memberCreators } from "./model.mjs";
import { publicPost } from "./post.mjs";

export const recentScenarios = [
  {
    ...fanFrame,
    active: "Início",
    cards: [publicPost],
    id: "fan-recent",
    intro: "Publicações recentes da comunidade.",
    label: "Fã · recentes",
    layout: "feed",
    notice:
      "Referência do KAR-145 para separar recentes (/) de seguindo (/feed), conforme KAR-143. Conteúdo público fictício; a implementação preserva os filtros e regras de acesso de cada fonte.",
    route: "/",
    secondary: { cards: memberCreators.slice(1), title: "Conheça também" },
    tab: "Recentes",
    tabs: feedTabs,
    title: "Início",
  },
];
