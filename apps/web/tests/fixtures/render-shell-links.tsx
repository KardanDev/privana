import { defaultPlatformConfig } from "@privana/api/contracts/platform";
import { renderToStaticMarkup } from "react-dom/server";
import { OperationsShell } from "../../src/domains/admin/operations-shell";
import { SidebarAccount } from "../../src/shared/layout/sidebar-account";
import { Topbar } from "../../src/shared/layout/topbar";
import { PlatformContext } from "../../src/shared/platform/platform-context";

const registration = process.argv[2] !== "closed";
const operations = process.argv[3] === "operations";
const ignoreStaticAction = () => {
  /* No operations execute in static review. */
};
const config = {
  ...defaultPlatformConfig,
  features: { ...defaultPlatformConfig.features, registration },
};
const content = operations ? (
  <OperationsShell
    onSelect={ignoreStaticAction}
    section="overview"
    viewerName="Equipe fictícia"
    viewerRole="admin"
  >
    <p>Exemplo estático, sem conta ou operação real.</p>
  </OperationsShell>
) : (
  <>
    <Topbar viewer={null} />
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="font-heading text-3xl">Links de entrada em revisão</h1>
      <p className="mb-6 text-muted-foreground text-sm">
        Componentes reais, apresentação estática. Somente destinos locais de
        exemplo.
      </p>
      <section aria-label="Entrada pela barra lateral" className="max-w-60">
        <SidebarAccount viewer={null} />
      </section>
    </main>
  </>
);
process.stdout.write(
  renderToStaticMarkup(
    <PlatformContext value={config}>{content}</PlatformContext>
  )
);
