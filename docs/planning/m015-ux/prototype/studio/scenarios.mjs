import { fanFrame } from "../fan/model.mjs";
import { createProfileCases } from "./create-profile-cases.mjs";
import { studioFrame } from "./model.mjs";

export const studioScenarios = [
  ...["apply", "pending", "active"].flatMap(createProfileCases),
  {
    ...studioFrame,
    actions: [{ label: "Editar perfil", target: "studio-profile-active" }],
    cards: [
      {
        text: [
          "Revise as informações públicas e o valor planejado. Pagamentos continuam em demonstração.",
        ],
        title: "Seu perfil, do seu jeito",
      },
    ],
    id: "studio-overview",
    label: "Studio · entrada do espaço de trabalho",
    notice:
      "Entrada de criadora ativa e perfil no KAR-179. Composição, listas e ciclo de publicação chegam no KAR-183; nenhum controle de publicação incompleto é apresentado.",
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
