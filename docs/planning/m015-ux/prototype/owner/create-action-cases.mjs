import { ownerActions } from "./action-definitions.mjs";
import { createActionForm } from "./create-action-form.mjs";
import { createOwnerFrame } from "./create-frame.mjs";

export function createActionCases(role) {
  return ownerActions
    .filter((action) =>
      action.adminOnly
        ? role === "admin"
        : ["admin", "moderator"].includes(role)
    )
    .flatMap((action) => {
      const base = createOwnerFrame(role, action.section);
      const id = `owner-${role}-${action.code}`;
      const back = `owner-${role}-${action.section}`;
      const frame = {
        ...base,
        cards: [{ text: [action.detail], title: "O que muda" }],
        title: action.title,
      };
      const form = createActionForm(action.code, id);
      const audit =
        action.code === "team-role"
          ? {
              fallback: "editor",
              from: `${id}:role`,
              labels: {
                analyst: "Analista",
                editor: "Editor",
                member: "Membro",
                moderator: "Moderador",
              },
              prefix: "TEAM_ROLE_CHANGED · member → ",
            }
          : action.event;
      return [
        {
          ...frame,
          actions: [
            {
              label: "Confirmar decisão",
              target: `${id}-pending`,
              validates: Boolean(form),
            },
            { label: "Cancelar", resetGroup: id, target: back },
          ],
          form,
          id: `${id}-review`,
          label: `${role} · ${action.code} · confirmar`,
        },
        {
          ...frame,
          actions: [{ disabled: true, label: "Confirmando…" }],
          feedback: "Aguardando confirmação. O registro ainda não mudou.",
          id: `${id}-pending`,
          label: `${role} · ${action.code} · pendente`,
          outcomes: [
            { label: "Exemplo: falhou", target: `${id}-failed` },
            { label: "Exemplo: confirmado", target: `${id}-done` },
          ],
        },
        {
          ...frame,
          actions: [
            {
              label: "Tentar novamente",
              target: `${id}-pending`,
              validates: Boolean(form),
            },
            { label: "Cancelar", resetGroup: id, target: back },
          ],
          error: true,
          feedback:
            "Não foi possível confirmar a decisão. Revise e tente novamente; os campos foram mantidos.",
          form,
          id: `${id}-failed`,
          label: `${role} · ${action.code} · falha`,
        },
        {
          ...base,
          actions: [
            {
              label: "Voltar aos registros de exemplo",
              resetGroup: id,
              target: back,
            },
          ],
          cards: [
            {
              text: [
                audit,
                ...(action.code === "access-revoke"
                  ? [
                      {
                        fallback:
                          "Solicitação de revisão do acesso de demonstração.",
                        from: `${id}:reason`,
                        prefix: "Motivo: ",
                      },
                    ]
                  : []),
                "07/11/2026 · 14:30 BRT · Equipe de demonstração",
                "Este exemplo não altera a lista independente de registros fictícios.",
              ],
              title: "Contexto de auditoria",
            },
          ],
          feedback: "Decisão confirmada neste exemplo local.",
          id: `${id}-done`,
          label: `${role} · ${action.code} · confirmado`,
          title: action.result,
        },
      ];
    });
}
