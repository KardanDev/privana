import { fanFrame, fanNavigation } from "../fan/model.mjs";

const navigation = [
  ...fanNavigation.slice(0, 2),
  { icon: "studio", label: "Meu Studio", target: "studio-overview" },
  ...fanNavigation.slice(2),
];
export const studioFrame = {
  ...fanFrame,
  active: "Meu Studio",
  intro: "Seu conteúdo e sua comunidade, de perto.",
  mobileNavigation: navigation
    .filter((item) => !["Salvos", "Assinaturas"].includes(item.label))
    .map((item) =>
      item.label === "Meu Studio"
        ? { ...item, activeLabel: "Meu Studio", label: "Studio" }
        : item
    ),
  navigation,
  notice:
    "Exemplos locais de criadora ativa. Aprovação de publicação não equivale a comprovação de identidade ou idade. Nenhum upload ou post real é criado.",
  route: "/studio",
  tab: "Minhas publicações",
  tabs: [
    {
      icon: "studio",
      label: "Minhas publicações",
      target: "studio-overview",
    },
    {
      icon: "account",
      label: "Editar perfil",
      target: "studio-profile-active",
    },
  ],
  title: "Meu Studio",
};
export const profileFields = [
  {
    label: "Nome de exibição",
    max: 80,
    min: 2,
    name: "displayName",
    required: true,
    value: "Isabela Ferreira",
  },
  {
    hint: "Letras minúsculas, números, hífen ou sublinhado.",
    label: "Seu @usuário",
    max: 40,
    min: 3,
    name: "handle",
    pattern: "(?:[a-z0-9_]|-)+",
    required: true,
    value: "isabela-demo",
  },
  {
    label: "Sobre você",
    max: 2000,
    name: "bio",
    type: "textarea",
    value: "Um diário de ensaios, bastidores e pequenos momentos.",
  },
  {
    label: "Categoria",
    max: 60,
    min: 2,
    name: "category",
    required: true,
    value: "Estilo de vida",
  },
  {
    label: "Localização",
    max: 120,
    name: "location",
    value: "São Paulo, Brasil",
  },
  {
    label: "Foto pública (HTTPS)",
    max: 2048,
    name: "avatarUrl",
    pattern: "https://.*",
    type: "url",
    value: "",
  },
  {
    label: "Capa pública (HTTPS)",
    max: 2048,
    name: "coverUrl",
    pattern: "https://.*",
    type: "url",
    value: "",
  },
  {
    hint: "Valor de referência. Não habilita cobranças.",
    label: "Valor mensal planejado (R$)",
    maxValue: 10_000,
    minValue: 0,
    name: "price",
    required: true,
    step: "0.01",
    type: "number",
    value: "29.90",
  },
];
