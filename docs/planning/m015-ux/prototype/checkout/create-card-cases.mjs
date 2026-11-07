import { cardFields, currencies, demoFrame, demoResult } from "./model.mjs";

export function createCardCases(currency) {
  const chooseId = `demo-card-${currency.value}`;
  const reviewId = `demo-review-${currency.value}`;
  const frame = {
    ...demoFrame,
    cards: [
      {
        text: [
          "Use somente estes dados fictícios. Os campos são exemplos somente leitura.",
        ],
        title: "Cartão de teste",
      },
    ],
    secondary: {
      cards: [
        {
          text: [
            currency.price,
            "Preço de referência. Não há cobrança nem renovação automática.",
          ],
          title: "Isabela Ferreira",
        },
      ],
      title: "Resumo da demonstração",
    },
  };
  const form = {
    fields: [
      {
        casePrefix: "demo-card-",
        label: "Moeda de referência",
        name: "currency",
        options: currencies,
        type: "select",
        value: currency.value,
      },
      ...cardFields,
    ],
    group: "card",
    layout: "compact",
    legend: "Dados de teste",
  };
  return [
    {
      ...frame,
      actions: [
        { label: "Revisar demonstração", target: reviewId },
        { label: "Usar Pix em BRL", target: "demo-pix-choose" },
        { label: "Voltar ao perfil", target: "fan-member-profile-isabela" },
      ],
      form,
      formPlacement: "after",
      id: chooseId,
      label: `Demo · cartão ${currency.value.toUpperCase()}`,
      outcomes: [
        {
          label: "Simular dados inválidos",
          target: `demo-invalid-${currency.value}`,
        },
      ],
    },
    {
      ...frame,
      actions: [{ label: "Carregar dados de teste", target: chooseId }],
      error: true,
      feedback:
        "Use o cartão de teste 4242 4242 4242 4242, validade 12/30 e CVC 123.",
      focusField: "number",
      form: {
        ...form,
        fields: [{ ...cardFields[0], value: "" }, ...cardFields.slice(1)],
      },
      formPlacement: "after",
      id: `demo-invalid-${currency.value}`,
      invalidFields: ["number"],
      label: `Demo · cartão inválido ${currency.value.toUpperCase()}`,
    },
    {
      ...frame,
      actions: [
        {
          label: "Simular aprovação",
          target: `demo-approved-${currency.value}`,
        },
        { label: "Simular recusa", target: `demo-declined-${currency.value}` },
        { label: "Voltar aos dados", target: chooseId },
      ],
      cards: [
        {
          text: [
            "Nenhum valor será cobrado. Nenhuma assinatura ou acesso será criado.",
          ],
          title: `Cartão · ${currency.price}`,
        },
      ],
      id: reviewId,
      label: `Demo · revisar ${currency.value.toUpperCase()}`,
      title: "Revise o exemplo",
    },
    {
      ...frame,
      actions: [
        { label: "Tentar com os dados de teste", target: chooseId },
        { label: "Experimentar Pix em BRL", target: "demo-pix-choose" },
      ],
      error: true,
      feedback: "Recusa simulada. Nenhuma cobrança foi feita.",
      id: `demo-declined-${currency.value}`,
      label: `Demo · recusa ${currency.value.toUpperCase()}`,
      title: "O exemplo não foi concluído",
    },
    {
      ...frame,
      ...demoResult,
      cards: [
        {
          text: ["Este resultado não confirma um pagamento ou uma assinatura."],
          title: `Referência: ${currency.price}`,
        },
      ],
      id: `demo-approved-${currency.value}`,
      label: `Demo · resultado ${currency.value.toUpperCase()}`,
    },
  ];
}
