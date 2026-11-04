import type { PlatformConfig } from "@privana/api/contracts/platform";
import { type CmsRowField, CmsRows } from "./cms-rows";

const fields: CmsRowField[] = [
  {
    label: "Endereço: /pages/",
    maxLength: 80,
    name: "pageSlug",
    pattern: "[a-z0-9]+(-[a-z0-9]+)*",
    placeholder: "sobre-a-plataforma",
  },
  { label: "Título", maxLength: 120, name: "pageTitle" },
  {
    label: "Conteúdo em texto",
    maxLength: 20_000,
    multiline: true,
    name: "pageBody",
  },
];

export function CmsPageFields({
  config,
  onEdit,
}: {
  config: PlatformConfig;
  onEdit: () => void;
}) {
  return (
    <CmsRows
      fields={fields}
      initial={config.pages.map((page) => ({
        pageBody: page.body,
        pageSlug: page.slug,
        pageTitle: page.title,
      }))}
      maximum={20}
      onEdit={onEdit}
      title="Páginas públicas de informação"
    />
  );
}
