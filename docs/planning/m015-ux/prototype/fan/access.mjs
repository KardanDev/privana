import { fanFrame } from "./model.mjs";

const memberships = {
  ...fanFrame,
  active: "Assinaturas",
  route: "/memberships",
  title: "Assinaturas",
};
export const accessScenarios = [
  {
    ...memberships,
    cards: [
      {
        actions: [
          { label: "Ver conteúdo de exemplo", target: "fan-recorded-access" },
        ],
        text: [
          "Acesso ativo de exemplo · válido até 14 de novembro de 2026.",
          "Registro fictício independente da demonstração de checkout. Nenhuma cobrança real.",
        ],
        title: "Isabela Ferreira",
      },
      {
        actions: [
          { label: "Ver perfil bloqueado", target: "fan-member-profile-luna" },
        ],
        text: [
          "Acesso expirado de exemplo. Não há renovação automática neste protótipo.",
        ],
        title: "Luna Martins",
      },
    ],
    id: "fan-memberships",
    label: "Fã · acessos registrados",
  },
  {
    ...memberships,
    actions: [{ label: "Explorar criadores", target: "fan-discover-member" }],
    cards: [
      {
        text: [
          "A demonstração de pagamento não cria uma assinatura nem libera publicações.",
        ],
        title: "Nenhum acesso registrado",
      },
    ],
    id: "fan-memberships-empty",
    label: "Fã · sem acesso após demo",
  },
  {
    ...fanFrame,
    actions: [{ label: "Voltar às assinaturas", target: "fan-memberships" }],
    cards: [
      {
        text: [
          "Texto fictício visível graças ao registro ativo independente deste caso. Nenhuma mídia privada é carregada.",
        ],
        title: "Ensaio para assinantes · exemplo",
      },
    ],
    id: "fan-recorded-access",
    intro: "Acesso ativo independente de checkout · Isabela Ferreira",
    label: "Fã · conteúdo com acesso registrado",
    route: "/creators/isabela-demo",
    title: "Isabela Ferreira",
  },
];
