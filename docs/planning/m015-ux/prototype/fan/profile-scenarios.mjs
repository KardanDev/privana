import { creators, fanFrame, publicFrame } from "./model.mjs";

export function createProfileCases(creator) {
  const profile = {
    cards: [
      {
        text: [
          "Um diário de ensaios e pequenos momentos. Perfil fictício usado nesta revisão.",
        ],
        title: "Entre uma foto e outra",
      },
      {
        kind: "locked",
        text: [
          "Você ainda não tem acesso a esta publicação. Registrar interesse ou fazer uma demonstração não libera conteúdo.",
        ],
        title: "Conteúdo para assinantes",
      },
    ],
    intro: creator.text.join(" · "),
    route: `/creators/${creator.handle}`,
    title: creator.title,
  };
  return [
    {
      ...publicFrame,
      ...profile,
      actions: [
        { label: "Entrar para acompanhar", target: "fan-login" },
        { label: "Explorar criadores", target: "fan-discover" },
      ],
      id: `fan-profile-${creator.key}`,
      label: `Perfil público · ${creator.title}`,
    },
    {
      ...fanFrame,
      ...profile,
      actions: [
        { label: "Registrar interesse", target: `fan-interest-${creator.key}` },
        { label: "Voltar à descoberta", target: "fan-discover-member" },
      ],
      id: `fan-member-profile-${creator.key}`,
      label: `Perfil para fã · ${creator.title}`,
    },
    {
      ...fanFrame,
      actions: [
        {
          label: "Voltar ao perfil",
          target: `fan-member-profile-${creator.key}`,
        },
      ],
      cards: [],
      feedback:
        "Este exemplo confirma apenas o registro de interesse. Nenhum aviso por e-mail é prometido.",
      id: `fan-interest-${creator.key}`,
      intro: creator.title,
      label: `Interesse · ${creator.title}`,
      route: profile.route,
      title: "Interesse registrado",
    },
  ];
}

export const profileScenarios = creators.flatMap(createProfileCases);
