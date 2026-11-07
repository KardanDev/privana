import { fanFrame } from "./model.mjs";

const settings = {
  ...fanFrame,
  actions: [
    {
      label: "Salvar alterações",
      target: "fan-settings-pending",
      validates: true,
    },
    { label: "Voltar à conta", target: "fan-account" },
  ],
  active: "Conta",
  form: {
    fields: [
      {
        label: "Seu nome",
        max: 80,
        min: 2,
        name: "name",
        required: true,
        value: "Mariana Augusta de Albuquerque e Vasconcelos",
      },
      {
        label: "Novidades por e-mail quando os avisos estiverem disponíveis",
        name: "emailNotifications",
        type: "checkbox",
        value: true,
      },
    ],
    group: "settings",
    legend: "Detalhes da conta",
  },
  intro: "O perfil público de criador é editado no Studio.",
  route: "/settings",
  title: "Configurações",
};
export const accountScenarios = [
  {
    ...fanFrame,
    actions: [
      { label: "Salvos", target: "fan-saved-empty" },
      { label: "Assinaturas", target: "fan-memberships" },
      { label: "Configurações", target: "fan-settings" },
      { label: "Quero publicar", target: "studio-profile-apply" },
    ],
    active: "Conta",
    cards: [
      {
        text: [
          "Conta fictícia de fã. Configurações da conta não são o perfil público de um criador.",
        ],
        title: "Mariana Augusta de Albuquerque e Vasconcelos",
      },
    ],
    id: "fan-account",
    label: "Fã · conta e nome longo",
    route: "/settings",
    title: "Sua conta",
  },
  { ...settings, id: "fan-settings", label: "Fã · configurações" },
  {
    ...settings,
    actions: [{ disabled: true, label: "Salvando…" }],
    feedback: "Salvando suas preferências…",
    form: {
      ...settings.form,
      fields: settings.form.fields.map((field) => ({
        ...field,
        disabled: true,
      })),
    },
    id: "fan-settings-pending",
    label: "Fã · salvando preferências",
    outcomes: [
      { label: "Confirmar preferências", target: "fan-settings-saved" },
      { label: "Simular falha", target: "fan-settings-failed" },
    ],
  },
  {
    ...settings,
    error: true,
    feedback:
      "Não foi possível salvar. Suas alterações continuam no formulário.",
    id: "fan-settings-failed",
    label: "Fã · preferências falharam",
  },
  {
    ...settings,
    actions: [{ label: "Voltar às configurações", target: "fan-settings" }],
    feedback:
      "Preferências confirmadas neste exemplo. Nenhum aviso foi enviado.",
    id: "fan-settings-saved",
    label: "Fã · preferências confirmadas",
  },
];
