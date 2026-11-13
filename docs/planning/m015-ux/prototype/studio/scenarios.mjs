import { fanFrame } from "../fan/model.mjs";
import { contentScenarios, postListFrame } from "./content-scenarios.mjs";
import { createProfileCases } from "./create-profile-cases.mjs";

export const studioScenarios = [
  ...["apply", "pending", "active"].flatMap(createProfileCases),
  ...contentScenarios,
  {
    ...postListFrame,
    id: "studio-overview",
    label: "Studio · entrada do espaço de trabalho",
    notice:
      "Studio de criadora ativa, com perfil e ciclos de conteúdo locais. Filtros nomeados são fixtures independentes; o resultado de cada editor mantém o título e o estado que você confirmou.",
  },
  {
    ...fanFrame,
    actions: [{ label: "Voltar à comunidade", target: "fan-feed" }],
    cards: [],
    feedback:
      "Novas candidaturas estão fechadas. Perfis existentes seguem suas próprias regras.",
    id: "studio-apply-closed",
    label: "Studio · candidaturas fechadas",
    route: "/studio",
    title: "Candidaturas indisponíveis",
  },
  {
    ...fanFrame,
    actions: [
      { disabled: true, label: "Publicação indisponível" },
      { label: "Voltar à comunidade", target: "fan-feed" },
    ],
    cards: [
      {
        text: [
          "O perfil suspenso não pode editar informações nem publicar. Consulte a equipe de suporte configurada na plataforma.",
        ],
        title: "Edição indisponível",
      },
    ],
    feedback:
      "Perfil suspenso. O acesso da conta à comunidade é tratado separadamente.",
    id: "studio-restricted",
    label: "Studio · perfil suspenso",
    route: "/studio",
    title: "Perfil suspenso",
  },
];
