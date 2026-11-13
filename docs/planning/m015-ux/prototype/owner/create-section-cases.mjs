import { createOwnerFrame } from "./create-frame.mjs";
import { createRecords } from "./create-records.mjs";
import { ownerRoles, ownerSections } from "./model.mjs";

export function createSectionCases(role) {
  return ownerSections
    .filter((item) => item[2].includes(role))
    .map(([section, title]) => {
      const frame = createOwnerFrame(role, section);
      const records = createRecords(section, role);
      const id = `owner-${role}-${section}`;
      if (!records) {
        return {
          ...frame,
          cards:
            section === "cms"
              ? [
                  {
                    actions: [
                      {
                        label: "Editar conteúdo e marca",
                        target: `cms-${role}-brand`,
                      },
                    ],
                    text: [
                      "Edite o rascunho e revise antes de publicar. Salvar não muda o conteúdo público.",
                    ],
                    title: "Conteúdo e marca",
                  },
                ]
              : [
                  {
                    text: [
                      "128 pessoas · 12 criadores · 3 perfis em análise · 46 publicações · 24 acessos ativos · 2 denúncias abertas. Valores fictícios, não métricas do ambiente real.",
                    ],
                    title: "Últimos 30 dias · comunidade",
                  },
                  {
                    text: [
                      "BRL · recebido 299,00 · pendente 59,80 · falhou 29,90 · estornado 29,90",
                      "USD · recebido 39,60 · pendente 9,90 · falhou 0,00 · estornado 0,00",
                      "EUR · recebido 17,80 · pendente 0,00 · falhou 8,90 · estornado 0,00",
                      "Registros sandbox ilustrativos, independentes do checkout do protótipo, que não cobra nem registra acesso. Não há total misturando moedas.",
                    ],
                    title: "Movimentações por moeda",
                  },
                ],
          id,
          label: `${ownerRoles[role]} · ${title}`,
        };
      }
      const statuses = [
        ...new Set(records.rows.map((row) => row.status).filter(Boolean)),
      ];
      const labels = {
        ACTIVE: "Ativo",
        DISMISSED: "Descartada",
        EXPIRED: "Expirado",
        FAILED: "Falhou",
        OPEN: "Aberta",
        PENDING: "Pendente / em análise",
        RESOLVED: "Resolvida",
        SUCCEEDED: "Confirmado",
        SUSPENDED: "Suspenso",
      };
      return {
        ...frame,
        cards: [
          {
            table: {
              ...records,
              caption: `${title}: dados fictícios, somente para revisão.`,
            },
            text:
              {
                creators: [
                  "Aprovação para publicar não comprova identidade ou idade.",
                ],
                transactions: [
                  "Somente consulta. Nenhuma cobrança, devolução ou saque pode ser iniciado aqui.",
                ],
              }[section] ?? [],
            title: `${title} · exemplos`,
          },
        ],
        form: {
          fields: [
            {
              label: "Buscar registros",
              max: 120,
              name: "search",
              scope: "records",
              type: "search",
            },
            ...(statuses.length
              ? [
                  {
                    label: "Situação",
                    name: "status",
                    options: [
                      { label: "Todas", value: "" },
                      ...statuses.map((value) => ({
                        label: labels[value],
                        value,
                      })),
                    ],
                    scope: "records",
                    type: "select",
                    value: "",
                  },
                ]
              : []),
          ],
          group: id,
          layout: "record-filters",
          legend: `Filtrar ${title.toLocaleLowerCase("pt-BR")}`,
        },
        id,
        label: `${ownerRoles[role]} · ${title}`,
        recordSearch: true,
      };
    });
}
