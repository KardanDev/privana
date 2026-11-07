import {
  creators,
  fanFrame,
  loginFields,
  memberCreators,
  publicFrame,
} from "./model.mjs";

const discovery = {
  active: "Explorar",
  form: {
    fields: [
      {
        label: "Buscar criadores",
        name: "search",
        scope: "creators",
        type: "search",
        value: "",
      },
    ],
    group: "discovery",
    legend: "Descubra novos perfis",
  },
  layout: "grid",
  route: "/explore",
  title: "Encontre criadores para acompanhar.",
};
const login = {
  ...publicFrame,
  actions: [
    { label: "Entrar", target: "fan-login-pending" },
    { label: "Esqueci minha senha", target: "fan-recovery" },
  ],
  active: "Entrar",
  form: loginFields,
  route: "/login",
  title: "Entre na Privana",
};
export const publicScenarios = [
  {
    ...publicFrame,
    actions: [
      { label: "Explorar criadores", target: "fan-discover" },
      { label: "Criar conta", target: "fan-register-closed" },
    ],
    cards: creators.slice(0, 2),
    id: "fan-public",
    intro: "Explore perfis, siga criadores e encontre novas publicações.",
    label: "Público · entrada",
    layout: "grid",
    route: "/",
    title: "Mais perto de quem você acompanha.",
  },
  {
    ...publicFrame,
    ...discovery,
    cards: creators,
    id: "fan-discover",
    label: "Público · busca local",
  },
  {
    ...fanFrame,
    ...discovery,
    cards: memberCreators,
    id: "fan-discover-member",
    label: "Fã · descoberta",
  },
  {
    ...login,
    id: "fan-login",
    label: "Conta · entrar",
    notice:
      "Campos de teste somente leitura. O destino atual após login é /feed; a correção de retorno seguro continua pendente em KAR-152/M02.",
  },
  {
    ...login,
    actions: [{ disabled: true, label: "Entrando…" }],
    feedback: "Entrando…",
    id: "fan-login-pending",
    label: "Conta · entrando",
    outcomes: [
      { label: "Simular resposta válida", target: "fan-feed" },
      { label: "Simular credenciais inválidas", target: "fan-login-failed" },
    ],
  },
  {
    ...login,
    error: true,
    feedback: "E-mail ou senha incorretos. Confira os dados e tente novamente.",
    focusField: "email",
    id: "fan-login-failed",
    label: "Conta · credenciais inválidas",
  },
  {
    ...publicFrame,
    actions: [{ label: "Entrar", target: "fan-login" }],
    feedback: "Já tem uma conta? Você pode entrar.",
    id: "fan-register-closed",
    label: "Conta · cadastro indisponível",
    route: "/register",
    title: "Novos cadastros estão fechados",
  },
  {
    ...publicFrame,
    actions: [{ label: "Solicitar link", target: "fan-recovery-result" }],
    form: {
      ...loginFields,
      fields: [loginFields.fields[0]],
      legend: "Solicitar recuperação",
    },
    id: "fan-recovery",
    label: "Conta · recuperação",
    route: "/forgot-password",
    title: "Recupere seu acesso",
  },
  {
    ...publicFrame,
    actions: [{ label: "Voltar para entrar", target: "fan-login" }],
    feedback:
      "Se houver uma conta com esse endereço, as instruções serão enviadas. Nenhum e-mail foi enviado pelo protótipo.",
    id: "fan-recovery-result",
    label: "Conta · resposta genérica",
    route: "/forgot-password",
    title: "Confira seu e-mail",
  },
  {
    ...fanFrame,
    actions: [{ label: "Explorar criadores", target: "fan-discover-member" }],
    active: "Início",
    cards: [
      {
        text: ["Siga criadores para acompanhar suas publicações aqui."],
        title: "Encontre sua próxima conexão",
      },
    ],
    id: "fan-feed",
    label: "Conta · destino após entrada",
    notice:
      "Entrada mínima após autenticação fictícia; a jornada completa de comunidade pertence a KAR-181.",
    route: "/feed",
    title: "Seu feed começa com quem você acompanha.",
  },
];
