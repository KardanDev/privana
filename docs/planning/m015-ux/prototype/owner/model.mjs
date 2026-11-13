export const ownerRoles = {
  admin: "Superadministrador",
  analyst: "Analista",
  editor: "Editor",
  moderator: "Moderador",
};
export const ownerSections = [
  ["overview", "Visão geral", ["admin", "analyst"]],
  ["users", "Pessoas e equipe", ["admin", "moderator"]],
  ["creators", "Criadores", ["admin", "moderator"]],
  ["reports", "Denúncias", ["admin", "moderator"]],
  ["subscriptions", "Assinaturas", ["admin", "analyst"]],
  ["transactions", "Transações", ["admin", "analyst"]],
  ["cms", "Conteúdo e marca", ["admin", "editor"]],
  ["audits", "Auditoria", ["admin"]],
];
