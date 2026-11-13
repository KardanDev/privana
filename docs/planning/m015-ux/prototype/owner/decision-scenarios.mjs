import { createActionCases } from "./create-action-cases.mjs";
import { createOwnerFrame } from "./create-frame.mjs";

export const ownerDecisionScenarios = ["admin", "moderator"].flatMap((role) => [
  ...createActionCases(role),
  {
    ...createOwnerFrame(role, "reports"),
    actions: [
      {
        label: "Resolver denúncia",
        target: `owner-${role}-report-resolve-review`,
      },
      {
        label: "Descartar denúncia",
        target: `owner-${role}-report-dismiss-review`,
      },
      { label: "Voltar à fila", target: `owner-${role}-reports` },
    ],
    cards: [
      {
        text: [
          "A pessoa relata possível uso de sua imagem sem autorização. Exemplo fictício de denúncia aberta.",
        ],
        title: "Relato recebido",
      },
      {
        text: [
          "@luna-demo · Publicação: Bastidores da semana",
          "Texto de referência: um encontro entre luz, movimento e rotina. Nenhuma mídia privada ou conversa é carregada pelo protótipo.",
        ],
        title: "Conteúdo associado",
      },
    ],
    id: `owner-${role}-report-inspect-review`,
    label: `${role} · inspecionar denúncia`,
    title: "DEN-104 · Uso de imagem",
  },
]);
