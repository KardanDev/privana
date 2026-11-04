const labels: Record<string, string> = {
  ACTIVE: "Assinatura ativa",
  CANCELED: "Assinatura encerrada",
  EXPIRED: "Assinatura expirada",
  INTEREST_REGISTERED: "Na lista de lançamento",
};

export function membershipStatusLabel(status: string) {
  return labels[status] ?? "Assinatura encerrada";
}
