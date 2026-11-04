"use client";

import type { CmsDocumentDTO } from "@privana/api/contracts/platform";
import { Button } from "@privana/ui/components/button";
import { Eye, Save, Send } from "lucide-react";
import { formatDate } from "@/shared/formatting/format-date";
import { CmsBrandFields } from "./cms-brand-fields";
import { CmsContentFields } from "./cms-content-fields";
import { CmsFeatureFields } from "./cms-feature-fields";
import { CmsHistory } from "./cms-history";
import { CmsNavigationFields } from "./cms-navigation-fields";
import { CmsPageFields } from "./cms-page-fields";
import { CmsPreview } from "./cms-preview";
import { useCmsTabs } from "./use-cms-tabs";
import { useCmsWorkspace } from "./use-cms-workspace";

const tabs = [
  { id: "brand", label: "Marca" },
  { id: "content", label: "Conteúdo" },
  { id: "navigation", label: "Navegação" },
  { id: "pages", label: "Páginas" },
  { id: "features", label: "Recursos" },
];

export function CmsWorkspace({ document }: { document: CmsDocumentDTO }) {
  const state = useCmsWorkspace(document);
  const tab = useCmsTabs();
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4">
        <div>
          <p className="font-medium text-sm">
            Rascunho · versão {document.version}
            {state.dirty ? " · alterações locais" : ""}
          </p>
          <p className="mt-1 text-muted-foreground text-xs">
            {document.publishedAt
              ? `Última publicação: ${formatDate(document.publishedAt)}`
              : "Ainda não publicado. A plataforma usa a configuração inicial."}
          </p>
        </div>
        <Button
          disabled={state.pending}
          onClick={state.showPreview}
          size="sm"
          type="button"
          variant="outline"
        >
          <Eye data-icon="inline-start" />
          Prévia do rascunho
        </Button>
      </div>
      <form
        className="rounded-xl border bg-card"
        noValidate
        onChange={state.changed}
        onSubmit={state.save}
        ref={state.formRef}
      >
        <fieldset
          aria-label="Seções do conteúdo"
          className="flex flex-wrap gap-1 border-b p-3"
          disabled={state.pending}
        >
          {tabs.map((item) => (
            <Button
              aria-controls={`cms-panel-${item.id}`}
              aria-pressed={tab.tab === item.id}
              key={item.id}
              onClick={tab.select}
              size="sm"
              type="button"
              value={item.id}
              variant={tab.tab === item.id ? "secondary" : "ghost"}
            >
              {item.label}
            </Button>
          ))}
        </fieldset>
        <fieldset className="min-w-0 p-5 sm:p-6" disabled={state.pending}>
          <div hidden={tab.tab !== "brand"} id="cms-panel-brand">
            <CmsBrandFields config={document.draft} />
          </div>
          <div hidden={tab.tab !== "content"} id="cms-panel-content">
            <CmsContentFields config={document.draft} />
          </div>
          <div hidden={tab.tab !== "navigation"} id="cms-panel-navigation">
            <CmsNavigationFields
              config={document.draft}
              onEdit={state.changed}
            />
          </div>
          <div hidden={tab.tab !== "pages"} id="cms-panel-pages">
            <CmsPageFields config={document.draft} onEdit={state.changed} />
          </div>
          <div hidden={tab.tab !== "features"} id="cms-panel-features">
            <CmsFeatureFields config={document.draft} />
          </div>
        </fieldset>
        {state.error ? (
          <p
            className="mx-5 mb-5 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-destructive text-sm"
            role="alert"
          >
            {state.error}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4">
          <p className="text-muted-foreground text-xs">
            {state.dirty
              ? "Salve o rascunho antes de publicar ou restaurar uma versão."
              : "Salvar rascunho não altera o conteúdo público."}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={state.pending}
              size="sm"
              type="submit"
              variant="outline"
            >
              <Save data-icon="inline-start" />
              {state.pending ? "Salvando…" : "Salvar rascunho"}
            </Button>
            <Button
              disabled={state.pending || state.dirty}
              onClick={state.requestPublish}
              size="sm"
              type="button"
            >
              <Send data-icon="inline-start" />
              Publicar versão
            </Button>
          </div>
        </div>
      </form>
      {state.confirmPublish ? (
        <section className="rounded-xl border border-primary/30 bg-accent p-5">
          <h2 className="font-semibold text-sm">
            Publicar este rascunho na plataforma?
          </h2>
          <p className="mt-2 text-muted-foreground text-sm">
            Marca, textos, navegação, páginas e recursos ficarão disponíveis ao
            público. A decisão será registrada na auditoria.
          </p>
          <div className="mt-4 flex gap-2">
            <Button
              disabled={state.pending}
              onClick={state.cancelPublish}
              size="sm"
              variant="outline"
            >
              Cancelar
            </Button>
            <Button disabled={state.pending} onClick={state.publish} size="sm">
              Confirmar publicação
            </Button>
          </div>
        </section>
      ) : null}
      {state.preview ? <CmsPreview config={state.preview} /> : null}
      <CmsHistory
        disabled={state.pending || state.dirty}
        onRestore={state.restore}
      />
    </div>
  );
}
