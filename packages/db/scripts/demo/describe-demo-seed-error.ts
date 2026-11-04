const prismaFailures: Record<string, string> = {
  P1000: "O banco rejeitou as credenciais de conexão.",
  P1001: "Não foi possível alcançar o banco de dados.",
  P1002: "A conexão com o banco excedeu o tempo limite.",
  P2002: "Um identificador reservado conflita com um registro existente.",
  P2003: "Uma relação obrigatória de demonstração não pôde ser criada.",
  P2021: "Uma tabela necessária não existe. Aplique as migrações.",
  P2022: "Uma coluna necessária não existe. Aplique as migrações.",
  P2028:
    "A transação expirou ou foi encerrada antes de concluir a demonstração.",
};

export function describeDemoSeedError(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const { code } = error;
    if (typeof code === "string" && Object.hasOwn(prismaFailures, code)) {
      return `${prismaFailures[code]} (${code})`;
    }
    if (code === "EEXIST") {
      return "Outra execução está em andamento ou deixou um arquivo de bloqueio. Verifique o processo antes de remover o bloqueio.";
    }
  }
  return "Verifique o opt-in, ambiente, conexão, arquivo ignorado e eventuais conflitos de dados.";
}
