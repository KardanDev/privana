import { ownerRoles, ownerSections } from "./model.mjs";

export function createOwnerFrame(role, section) {
  const allowed = ownerSections.filter((item) => item[2].includes(role));
  const current = allowed.find((item) => item[0] === section) ?? allowed[0];
  return {
    actions: [],
    active: current[1],
    cards: [],
    intro: `${ownerRoles[role]} · Dados fictícios para revisão.`,
    layout: "rows",
    mobileNavigation: [],
    navigation: [
      ...allowed.map(([id, label]) => ({
        icon: "operations",
        label,
        target: `owner-${role}-${id}`,
      })),
      { icon: "home", label: "Voltar à comunidade", target: "fan-feed" },
    ],
    notice:
      "As oito seções são estados internos de /admin. Papéis e permissões seguem a API atual; trocar o caso de revisão não altera o acesso de uma conta.",
    route: "/admin",
    sectionMenu: {
      fields: [
        {
          casePrefix: `owner-${role}-`,
          label: "Seção",
          name: "section",
          options: allowed.map(([value, label]) => ({ label, value })),
          type: "select",
          value: current[0],
        },
      ],
      group: `owner-${role}-section`,
      layout: "section-menu",
      legend: "Espaço da equipe",
    },
    shell: "owner",
    title: current[1],
  };
}
