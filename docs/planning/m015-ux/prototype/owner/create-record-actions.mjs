export function createRecordActions(role, key) {
  if (!["admin", "moderator"].includes(role)) {
    return [];
  }
  const entries = {
    "ASS-201":
      role === "admin" ? [["Revogar acesso ASS-201", "access-revoke"]] : [],
    "DEN-104": [["Inspecionar DEN-104", "report-inspect"]],
    isabela: [["Suspender Isabela", "creator-suspend"]],
    julia: [["Reativar Júlia", "creator-activate"]],
    luna: [["Revisar Luna", "creator-approve"]],
    marina: [
      ["Suspender Marina", "user-suspend"],
      ...(role === "admin" ? [["Alterar papel de Marina", "team-role"]] : []),
    ],
    renata: [["Reativar Renata", "user-activate"]],
  };
  return (entries[key] ?? []).map(([label, code]) => ({
    label,
    primary: false,
    target: `owner-${role}-${code}-review`,
  }));
}
