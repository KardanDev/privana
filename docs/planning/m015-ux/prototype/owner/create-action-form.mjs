export function createActionForm(code, group) {
  if (code === "access-revoke") {
    return {
      fields: [
        {
          label: "Motivo",
          max: 1000,
          min: 10,
          name: "reason",
          required: true,
          type: "textarea",
          value: "Solicitação de revisão do acesso de demonstração.",
        },
        {
          label: "Entendo que esta ação muda apenas o acesso local.",
          name: "confirmed",
          required: true,
          type: "checkbox",
        },
      ],
      group,
      legend: "Motivo da decisão",
    };
  }
  if (code === "team-role") {
    return {
      fields: [
        {
          label: "Papel de Marina",
          name: "role",
          options: [
            ["member", "Membro"],
            ["editor", "Editor"],
            ["moderator", "Moderador"],
            ["analyst", "Analista"],
          ].map(([value, label]) => ({ label, value })),
          type: "select",
          value: "editor",
        },
      ],
      group,
      legend: "Novo papel",
    };
  }
}
