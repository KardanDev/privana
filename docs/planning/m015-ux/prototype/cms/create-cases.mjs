import { createOwnerFrame } from "../owner/create-frame.mjs";
import { cmsAction } from "./action.mjs";
import { cmsFields, cmsTabOrder, cmsTabs } from "./fields.mjs";

export function createCmsCases(role) {
  const prefix = `cms-${role}`;
  const owner = createOwnerFrame(role, "cms");
  const base = {
    ...owner,
    cmsRole: role,
    guardGroup: prefix,
    guardTarget: `${prefix}-leave`,
    notice:
      "Roteiro local de edição, versões e recuperação. O seletor de casos apenas inspeciona telas; use os controles e resultados de exemplo para confirmar operações. Papéis usam estados independentes. Nenhuma configuração real é alterada.",
    sectionMenu: {
      ...owner.sectionMenu,
      fields: owner.sectionMenu.fields.map((field) => ({
        ...field,
        guardGroup: prefix,
        guardTarget: `${prefix}-leave`,
      })),
    },
  };
  const versions = {
    text: [
      {
        fallback: "2",
        from: `${prefix}:version`,
        prefix: "Versão carregada: ",
      },
      {
        fallback: "2",
        from: `${prefix}:publishedVersion`,
        prefix: "Revisão publicada: ",
      },
      {
        fallback: "2",
        from: `${prefix}:history`,
        prefix: "Histórico de revisões publicadas: ",
      },
    ],
    title: "Versões do conteúdo",
  };
  const edit = cmsAction(role, "Voltar ao rascunho", "open", "editor");
  const publish = cmsAction(
    role,
    "Publicar versão",
    "open",
    `${prefix}-publish-review`,
    true
  );
  const restore = cmsAction(
    role,
    "Restaurar revisão 2",
    "open",
    `${prefix}-restore-review`,
    true
  );
  const forms = cmsTabOrder.flatMap((tab) =>
    [false, true].map((invalid) => ({
      ...base,
      actions: [
        cmsAction(role, "Salvar rascunho", "save", `${prefix}-saving`),
        publish,
        cmsAction(role, "Prévia do rascunho", "preview", `${prefix}-preview`),
        cmsAction(role, "Histórico", "open", `${prefix}-history`),
      ],
      cards: [
        {
          text: [
            "Salvar rascunho não altera o conteúdo público. Salve antes de publicar ou restaurar.",
            ...(tab === "pages"
              ? [
                  "Uma página de exemplo neste roteiro; o CMS atual suporta até 20 páginas de texto.",
                ]
              : []),
            ...(tab === "navigation"
              ? [
                  "Um link de exemplo; o CMS atual suporta até 12 links no rodapé.",
                ]
              : []),
          ],
          title: "Antes de publicar",
        },
      ],
      cmsStatus: !invalid,
      cmsTab: tab,
      error: invalid,
      feedback: "Rascunho local",
      form: {
        fields: cmsFields[tab],
        group: prefix,
        layout: "cms-fields",
        legend: cmsTabs[tab],
        trackDirty: true,
      },
      id: `${prefix}-${tab}${invalid ? "-invalid" : ""}`,
      label: `${role} · CMS ${cmsTabs[tab]}${invalid ? " · validação" : ""}`,
      tab: cmsTabs[tab],
      tabs: cmsTabOrder.map((key) => ({
        icon: "studio",
        label: cmsTabs[key],
        target: `${prefix}-${key}`,
      })),
      title: "Conteúdo e marca",
    }))
  );
  const outcomes = ["save", "publish", "restore"].map((kind) => ({
    ...base,
    actions: [{ disabled: true, label: "Aguardando…" }],
    cards: [],
    feedback: "Aguardando confirmação. A versão ainda não mudou.",
    id: `${prefix}-${{ publish: "publishing", restore: "restoring", save: "saving" }[kind]}`,
    label: `${role} · CMS ${kind} pendente`,
    outcomes: [
      cmsAction(
        role,
        "Exemplo: confirmado",
        `commit-${kind}`,
        `${prefix}-${{ publish: "published", restore: "restored", save: "saved" }[kind]}`
      ),
      cmsAction(role, "Exemplo: falhou", "open", `${prefix}-failed`),
      cmsAction(
        role,
        "Exemplo: outra pessoa salvou",
        "conflict",
        `${prefix}-conflict`
      ),
    ],
    title: {
      publish: "Publicando versão",
      restore: "Restaurando revisão",
      save: "Salvando rascunho",
    }[kind],
  }));
  return [
    ...forms,
    ...outcomes,
    ...["saved", "published", "restored"].map((kind) => ({
      ...base,
      actions: [
        edit,
        publish,
        cmsAction(role, "Histórico", "open", `${prefix}-history`),
      ],
      cards: [versions],
      feedback:
        kind === "published"
          ? "Confirmação apenas neste exemplo local. Nenhuma plataforma real foi alterada."
          : "O conteúdo público continua na revisão publicada. Publique separadamente quando estiver pronto.",
      id: `${prefix}-${kind}`,
      label: `${role} · CMS ${kind}`,
      title: {
        published: "Versão publicada no exemplo",
        restored: "Revisão restaurada como rascunho",
        saved: "Rascunho salvo",
      }[kind],
    })),
    {
      ...base,
      actions: [
        cmsAction(
          role,
          "Confirmar publicação",
          "publish",
          `${prefix}-publishing`,
          true
        ),
        edit,
      ],
      cards: [versions],
      feedback:
        "Marca, textos, navegação, páginas e recursos desta versão substituirão o conteúdo público. A decisão terá registro de auditoria.",
      id: `${prefix}-publish-review`,
      label: `${role} · CMS confirmar publicação`,
      title: "Publicar este rascunho?",
    },
    {
      ...base,
      actions: [
        cmsAction(
          role,
          "Confirmar restauração",
          "restore",
          `${prefix}-restoring`,
          true
        ),
        edit,
      ],
      cards: [versions],
      feedback:
        "Cria uma nova versão do rascunho. A revisão publicada continua igual; a restauração exige uma publicação separada.",
      id: `${prefix}-restore-review`,
      label: `${role} · CMS confirmar restauração`,
      title: "Restaurar a revisão 2 como rascunho?",
    },
    {
      ...base,
      actions: [restore, edit],
      cards: [versions],
      id: `${prefix}-history`,
      label: `${role} · CMS histórico`,
      title: "Histórico de publicações",
    },
    {
      ...base,
      actions: [edit],
      cards: [{ cmsPreview: role }],
      id: `${prefix}-preview`,
      label: `${role} · CMS prévia local`,
      title: "Revise seu rascunho",
    },
    {
      ...base,
      actions: [edit],
      cards: [versions],
      error: true,
      feedback:
        "O rascunho foi mantido. Volte à edição para revisar e tentar novamente.",
      id: `${prefix}-failed`,
      label: `${role} · CMS falha`,
      title: "Não foi possível confirmar",
    },
    {
      ...base,
      actions: [
        edit,
        cmsAction(
          role,
          "Recarregar versão disponível",
          "open",
          `${prefix}-reload-review`
        ),
      ],
      cards: [
        versions,
        {
          text: [
            {
              fallback: "3",
              from: `${prefix}:serverVersion`,
              prefix: "Versão disponível no servidor de exemplo: ",
            },
            "Revise sua cópia local antes de recarregar. Recarregar descarta as alterações locais; não há substituição automática.",
          ],
          title: "Alterações locais preservadas",
        },
      ],
      error: true,
      feedback:
        "Sua edição foi mantida. Confira a versão disponível antes de descartar e recarregar.",
      id: `${prefix}-conflict`,
      label: `${role} · CMS conflito`,
      title: "Outra pessoa alterou este conteúdo",
    },
    {
      ...base,
      actions: [
        cmsAction(role, "Descartar e recarregar", "reload", "editor"),
        cmsAction(role, "Manter minha cópia", "open", `${prefix}-conflict`),
      ],
      cards: [],
      feedback:
        "A edição da outra pessoa substituirá sua cópia local. A revisão pública não muda.",
      id: `${prefix}-reload-review`,
      label: `${role} · CMS confirmar recarga`,
      title: "Descartar sua cópia local e recarregar?",
    },
    {
      ...base,
      actions: [edit, cmsAction(role, "Descartar e sair", "discard", "editor")],
      cards: [],
      feedback:
        "Continuar mantém seus campos. Descartar volta à última versão disponível e segue para o destino escolhido.",
      id: `${prefix}-leave`,
      label: `${role} · CMS sair com alterações`,
      title: "Descartar alterações não salvas?",
    },
  ];
}
