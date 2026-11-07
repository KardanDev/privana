import { fanFrame } from "../fan/model.mjs";

export const currencies = [
  { label: "BRL · real brasileiro", price: "R$ 29,90", value: "brl" },
  { label: "USD · dólar americano", price: "US$ 9,90", value: "usd" },
  { label: "EUR · euro", price: "€ 8,90", value: "eur" },
];
export const cardFields = [
  {
    label: "Número do cartão de teste",
    name: "number",
    sensitive: true,
    value: "4242 4242 4242 4242",
  },
  {
    label: "Validade de teste",
    name: "expiry",
    sensitive: true,
    value: "12/30",
  },
  { label: "CVC de teste", name: "cvc", sensitive: true, value: "123" },
];
export const demoFrame = {
  ...fanFrame,
  intro: "Demonstração sem cobrança e sem liberação de acesso.",
  layout: "checkout",
  notice:
    "Exemplo de fã conectado; a rota atual também é pública. Os preços USD/EUR são ilustrativos, não uma cotação. Não há provedor, pagamento ou sandbox comercial do servidor conectado a este protótipo.",
  route: "/checkout/isabela-demo",
  title: "Testar assinatura",
};
export const demoResult = {
  actions: [
    { label: "Ver assinaturas", target: "fan-memberships-empty" },
    { label: "Voltar ao perfil", target: "fan-member-profile-isabela" },
  ],
  feedback:
    "Demonstração concluída. Valor cobrado: zero. Acesso liberado: não.",
  title: "Demonstração concluída",
};
