export const fanNavigation = [
  { icon: "home", label: "Início", target: "fan-feed" },
  { icon: "explore", label: "Explorar", target: "fan-discover-member" },
];
export const publicFrame = {
  actions: [],
  cards: [],
  intro: "",
  mobileNavigation: [],
  navigation: [
    { icon: "explore", label: "Explorar", target: "fan-discover" },
    { icon: "account", label: "Entrar", target: "fan-login" },
  ],
  notice: "Perfis e respostas fictícios. Nenhum serviço é chamado.",
  shell: "public",
};
export const fanFrame = {
  ...publicFrame,
  mobileNavigation: fanNavigation,
  navigation: fanNavigation,
  shell: "fan",
};
export const creators = [
  {
    actions: [
      {
        ariaLabel: "Ver perfil de Isabela Ferreira",
        label: "Ver perfil",
        target: "fan-profile-isabela",
      },
    ],
    alt: "Imagem pública de referência para um perfil fictício",
    handle: "isabela-demo",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=360&h=420&q=75",
    key: "isabela",
    kind: "creator",
    text: ["@isabela-demo", "Estilo de vida · São Paulo"],
    title: "Isabela Ferreira",
  },
  {
    actions: [
      {
        ariaLabel: "Ver perfil de Luna Martins",
        label: "Ver perfil",
        target: "fan-profile-luna",
      },
    ],
    alt: "Imagem pública de referência para um perfil fictício",
    handle: "luna-demo",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=360&h=420&q=75",
    key: "luna",
    kind: "creator",
    text: ["@luna-demo", "Fotografia · Rio de Janeiro"],
    title: "Luna Martins",
  },
  {
    actions: [
      {
        ariaLabel: "Ver perfil de Júlia Ribeiro",
        label: "Ver perfil",
        target: "fan-profile-julia",
      },
    ],
    alt: "Imagem pública de referência para um perfil fictício",
    handle: "julia-demo",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=360&h=420&q=75",
    key: "julia",
    kind: "creator",
    text: ["@julia-demo", "Fotografia · Salvador"],
    title: "Júlia Ribeiro",
  },
];
export const memberCreators = creators.map((creator) => ({
  ...creator,
  actions: [
    {
      ariaLabel: `Ver perfil de ${creator.title}`,
      label: "Ver perfil",
      target: `fan-member-profile-${creator.key}`,
    },
  ],
}));
export const loginFields = {
  fields: [
    {
      label: "E-mail de exemplo",
      name: "email",
      sensitive: true,
      type: "email",
      value: "fa@example.test",
    },
    {
      label: "Senha de exemplo",
      name: "password",
      sensitive: true,
      type: "password",
      value: "senha-apenas-de-exemplo",
    },
  ],
  group: "login",
  legend: "Entre com sua conta",
};
