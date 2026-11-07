const navigation = [
  { icon: "home", label: "Início", target: "harness" },
  { icon: "explore", label: "Explorar", target: "harness-discovery" },
];
export const scenarios = [
  {
    actions: [{ label: "Explorar criadores", target: "harness-discovery" }],
    active: "Início",
    cards: [
      {
        text: [
          "Explore perfis e siga criadores para acompanhar suas publicações aqui.",
        ],
        title: "Encontre sua próxima conexão",
      },
    ],
    id: "harness",
    intro: "Publicações de quem você escolhe acompanhar.",
    label: "Estrutura · feed vazio",
    navigation,
    notice:
      "Caso estrutural do KAR-177. Os fluxos completos serão adicionados nas histórias seguintes.",
    route: "/",
    title: "Seu feed começa com quem você acompanha.",
  },
  {
    actions: [{ label: "Voltar ao início", target: "harness" }],
    active: "Explorar",
    cards: [
      {
        text: [
          "A biblioteca receberá casos de fãs, Studio e gestão em PRs separados. Este quadro verifica a estrutura, os temas e o retorno pelo navegador.",
        ],
        title: "Um lugar para revisar os próximos passos",
      },
    ],
    id: "harness-discovery",
    intro: "Os destinos deste exemplo ficam apenas neste protótipo.",
    label: "Estrutura · voltar da descoberta",
    navigation,
    notice:
      "Nenhum cadastro, acesso, pagamento ou publicação é criado pelos controles de revisão.",
    route: "/explore",
    title: "Encontre criadores para acompanhar.",
  },
];
