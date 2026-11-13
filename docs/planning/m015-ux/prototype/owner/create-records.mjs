export function createRecords(section) {
  const records = {
    audits: {
      columns: ["Quando", "Responsável", "Evento", "Referência"],
      rows: [
        {
          cells: [
            "07/11/2026 · 14:20 BRT",
            "Equipe de demonstração",
            "REPORT_RESOLVED",
            "DEN-103 · OPEN → RESOLVED",
          ],
        },
        {
          cells: [
            "07/11/2026 · 14:10 BRT",
            "Equipe de demonstração",
            "LOCAL_SUBSCRIPTION_ACCESS_REVOKED",
            "ASS-198 · billingChanged: false",
          ],
        },
      ],
    },
    creators: {
      columns: ["Perfil", "Publicação", "Conta"],
      rows: [
        {
          cells: ["Luna Moreira · @luna-demo", "Em análise", "Ativa"],
          status: "PENDING",
        },
        {
          cells: ["Isabela Ferreira · @isabela-demo", "Aprovada", "Ativa"],
          status: "ACTIVE",
        },
        {
          cells: ["Júlia Montenegro · @julia-demo", "Suspensa", "Ativa"],
          status: "SUSPENDED",
        },
      ],
    },
    reports: {
      columns: ["Denúncia", "Referência", "Situação"],
      rows: [
        {
          cells: [
            "DEN-104 · Possível uso de imagem sem autorização",
            "Publicação de @luna-demo",
            "Aberta",
          ],
          status: "OPEN",
        },
        {
          cells: [
            "DEN-103 · Classificação incorreta",
            "Perfil de @isabela-demo",
            "Resolvida",
          ],
          status: "RESOLVED",
        },
        {
          cells: ["DEN-102 · Duplicada", "Perfil de @julia-demo", "Descartada"],
          status: "DISMISSED",
        },
      ],
    },
    subscriptions: {
      columns: ["Acesso registrado", "Validade", "Situação"],
      rows: [
        {
          cells: ["ASS-201 · Marina → Isabela", "Até 30/11/2026", "Ativo"],
          status: "ACTIVE",
        },
        {
          cells: ["ASS-199 · Renata → Luna", "Até 31/10/2026", "Expirado"],
          status: "EXPIRED",
        },
      ],
    },
    transactions: {
      columns: ["Registro", "Pessoa e criador", "Valor", "Situação"],
      rows: [
        {
          cells: [
            "TX-301 · cobrança · sandbox",
            "Marina → Isabela",
            "BRL 29,90",
            "Confirmada",
          ],
          status: "SUCCEEDED",
        },
        {
          cells: [
            "TX-302 · cobrança · sandbox",
            "Renata → Luna",
            "USD 9,90",
            "Pendente",
          ],
          status: "PENDING",
        },
        {
          cells: [
            "TX-303 · cobrança · sandbox",
            "Marina → Júlia",
            "EUR 8,90",
            "Falhou",
          ],
          status: "FAILED",
        },
        {
          cells: [
            "TX-300 · estorno registrado · sandbox",
            "Renata → Luna",
            "BRL 29,90",
            "Confirmado",
          ],
          status: "SUCCEEDED",
        },
      ],
    },
    users: {
      columns: ["Pessoa", "Papel", "Situação"],
      rows: [
        {
          cells: [
            "Marina de Albuquerque · marina@example.test",
            "Membro · e-mail verificado",
            "Ativa",
          ],
          status: "ACTIVE",
        },
        {
          cells: ["Renata Barbosa · renata@example.test", "Membro", "Suspensa"],
          status: "SUSPENDED",
        },
        {
          cells: [
            "Camila Santos · camila@example.test",
            "Analista · equipe protegida",
            "Ativa",
          ],
          status: "ACTIVE",
        },
      ],
    },
  };
  return records[section];
}
