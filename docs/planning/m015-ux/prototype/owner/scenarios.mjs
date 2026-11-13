import { createOwnerFrame } from "./create-frame.mjs";
import { createSectionCases } from "./create-section-cases.mjs";
import { ownerRoles } from "./model.mjs";

export const ownerScenarios = Object.keys(ownerRoles).flatMap((role) => {
  const frame = createOwnerFrame(role, "reports");
  const entry = frame.navigation[0].target;
  const prefix = `owner-${role}`;
  return [
    ...createSectionCases(role),
    ...(role === "admin"
      ? []
      : [
          {
            ...frame,
            actions: [{ label: "Voltar ao espaço da equipe", target: entry }],
            cards: [
              {
                text: [
                  "Seu acesso não mudou. Volte a uma seção permitida; se precisar de outra responsabilidade, fale com a administração.",
                ],
                title: "Confira seu acesso",
              },
            ],
            id: `${prefix}-denied`,
            label: `${role} · permissão negada`,
            title: "Esta seção não está disponível para seu papel",
          },
        ]),
    ...["loading", "failed", "empty"].map((state) => ({
      ...frame,
      actions:
        state === "loading"
          ? [{ disabled: true, label: "Carregando…" }]
          : [
              {
                label:
                  state === "failed" ? "Tentar novamente" : "Voltar à seção",
                target: entry,
              },
            ],
      cards: [],
      error: state === "failed",
      feedback: {
        empty:
          "Novos registros aparecerão aqui quando existirem. Nenhuma operação é necessária agora.",
        failed:
          "Sua conta continua conectada. Tente carregar a seção novamente.",
        loading:
          "Aguarde a resposta. Nenhuma ação está disponível enquanto os dados carregam.",
      }[state],
      id: `${prefix}-${state}`,
      label: `${role} · ${state}`,
      outcomes:
        state === "loading"
          ? [
              { label: "Exemplo: carregou", target: entry },
              { label: "Exemplo: falhou", target: `${prefix}-failed` },
            ]
          : [],
      title: {
        empty: "Ainda não há registros nesta seção",
        failed: "Não foi possível carregar os registros",
        loading: "Carregando registros",
      }[state],
    })),
  ];
});
