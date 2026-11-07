import { demoFrame, demoResult } from "./model.mjs";

const pix = {
  ...demoFrame,
  cards: [
    {
      text: ["Preço de referência em reais. Nenhuma cobrança será criada."],
      title: "Pix · R$ 29,90",
    },
  ],
  title: "Pix de demonstração",
};
export const pixScenarios = [
  {
    ...pix,
    actions: [
      { label: "Revisar Pix de exemplo", target: "demo-pix-review" },
      { label: "Usar cartão", target: "demo-card-brl" },
    ],
    feedback: "Pix usa BRL neste exemplo. USD/EUR ficam no cartão de teste.",
    id: "demo-pix-choose",
    label: "Demo · escolher Pix",
  },
  {
    ...pix,
    actions: [
      { label: "Gerar exemplo de Pix", target: "demo-pix-waiting" },
      { label: "Voltar ao método", target: "demo-pix-choose" },
    ],
    id: "demo-pix-review",
    label: "Demo · revisar Pix",
    title: "Revise o exemplo de Pix",
  },
  {
    ...pix,
    actions: [
      { label: "Simular confirmação", target: "demo-pix-approved" },
      { label: "Voltar ao método", target: "demo-pix-choose" },
    ],
    feedback:
      "Código fictício. Não é pagável e não existe QR de cobrança real.",
    form: {
      fields: [
        {
          label: "Pix de exemplo — não pagável",
          name: "pix",
          readOnly: true,
          type: "textarea",
          value: "DEMONSTRACAO-PIX-NAO-PAGAVEL-SEM-VALOR",
        },
      ],
      group: "pix",
      legend: "Aguardando confirmação de exemplo",
    },
    formPlacement: "after",
    id: "demo-pix-waiting",
    label: "Demo · Pix aguardando",
    outcomes: [
      { label: "Simular expiração do Pix", target: "demo-pix-expired" },
    ],
  },
  {
    ...pix,
    actions: [
      { label: "Gerar novo exemplo", target: "demo-pix-waiting" },
      { label: "Usar cartão", target: "demo-card-brl" },
    ],
    error: true,
    feedback: "Gere outro exemplo para continuar. Nenhum valor foi cobrado.",
    id: "demo-pix-expired",
    label: "Demo · Pix expirado",
    title: "O exemplo de Pix expirou",
  },
  {
    ...pix,
    ...demoResult,
    id: "demo-pix-approved",
    label: "Demo · resultado Pix",
  },
];
