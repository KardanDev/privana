export const ownerActions = [
  {
    code: "user-suspend",
    detail:
      "A conta perderá o acesso e as sessões serão encerradas. Marina é membro, não é você nem uma conta de administração.",
    event: "USER_STATUS_CHANGED · ACTIVE → SUSPENDED",
    result: "Conta de Marina suspensa; sessões encerradas.",
    section: "users",
    title: "Suspender Marina?",
  },
  {
    code: "user-activate",
    detail:
      "O acesso da conta será reativado. Renata precisará entrar novamente.",
    event: "USER_STATUS_CHANGED · SUSPENDED → ACTIVE",
    result: "Conta de Renata reativada.",
    section: "users",
    title: "Reativar Renata?",
  },
  {
    code: "creator-approve",
    detail:
      "Perfil @luna-demo em análise. A aprovação permite publicar e atribui o papel de criador quando necessário. Não comprova identidade ou maioridade.",
    event: "CREATOR_STATUS_CHANGED · PENDING → ACTIVE",
    result: "Publicação de Luna aprovada.",
    section: "creators",
    title: "Aprovar publicação de Luna?",
  },
  {
    code: "creator-suspend",
    detail:
      "Perfil @isabela-demo aprovado. Suspender a publicação não suspende a conta da pessoa nem altera cobranças.",
    event: "CREATOR_STATUS_CHANGED · ACTIVE → SUSPENDED",
    result: "Publicação de Isabela suspensa.",
    section: "creators",
    title: "Suspender publicação de Isabela?",
  },
  {
    code: "creator-activate",
    detail:
      "Perfil @julia-demo suspenso. A reativação não comprova identidade ou maioridade.",
    event: "CREATOR_STATUS_CHANGED · SUSPENDED → ACTIVE",
    result: "Publicação de Júlia reativada.",
    section: "creators",
    title: "Reativar publicação de Júlia?",
  },
  {
    code: "report-resolve",
    detail:
      "Muda apenas a situação da denúncia. A publicação permanece; suspender perfil ou conta exige uma decisão separada.",
    event: "REPORT_RESOLVED · OPEN → RESOLVED",
    result: "DEN-104 marcada como resolvida.",
    section: "reports",
    title: "Resolver DEN-104?",
  },
  {
    code: "report-dismiss",
    detail:
      "Muda apenas a situação da denúncia para descartada. Nenhum conteúdo será removido.",
    event: "REPORT_RESOLVED · OPEN → DISMISSED",
    result: "DEN-104 descartada.",
    section: "reports",
    title: "Descartar DEN-104?",
  },
  {
    adminOnly: true,
    code: "team-role",
    detail:
      "Conta ativa, e-mail verificado, diferente da sua e sem papel admin. As sessões de Marina serão encerradas. Não é possível conceder administração por este controle.",
    event: "TEAM_ROLE_CHANGED · papel escolhido no formulário",
    result: "Papel de Marina alterado; sessões encerradas.",
    section: "users",
    title: "Alterar papel de Marina?",
  },
  {
    adminOnly: true,
    code: "access-revoke",
    detail:
      "Marina perderá o acesso local a Isabela. Não cancela assinatura no provedor, não interrompe cobrança e não cria estorno.",
    event:
      "LOCAL_SUBSCRIPTION_ACCESS_REVOKED · ACTIVE → REVOKED · billingChanged: false",
    result: "Acesso local ASS-201 revogado. Cobrança inalterada.",
    section: "subscriptions",
    title: "Revogar acesso ASS-201?",
  },
];
