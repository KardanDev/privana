import { defaultPlatformConfig } from "@privana/api/contracts/platform";
import { renderToStaticMarkup } from "react-dom/server";
import { OperationsShell } from "../../src/domains/admin/operations-shell";
import { SidebarAccount } from "../../src/shared/layout/sidebar-account";
import { Topbar } from "../../src/shared/layout/topbar";
import { PlatformContext } from "../../src/shared/platform/platform-context";
import { getNavigationReviewViewer } from "./get-navigation-review-viewer";
import { NavigationReview } from "./navigation-review";

const [, , registrationArg, workspace, scenario, flags = ""] = process.argv;
const registration = registrationArg !== "closed";
const operations = workspace === "operations";
const viewer = getNavigationReviewViewer(scenario ?? "anonymous");
const ignoreStaticAction = () => {
  /* No operations execute in static review. */
};
const config = {
  ...defaultPlatformConfig,
  features: {
    ...defaultPlatformConfig.features,
    creatorApplications: !flags.includes("applications-off"),
    messaging: !flags.includes("messaging-off"),
    registration,
  },
  navigation: {
    ...defaultPlatformConfig.navigation,
    studio: flags.includes("long")
      ? "Meu espaço de criação e acompanhamento de conteúdo"
      : "Estúdio",
  },
};
let content = operations ? (
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
if (scenario) {
  content = <NavigationReview viewer={viewer} />;
}
process.stdout.write(
  renderToStaticMarkup(
    <PlatformContext value={config}>{content}</PlatformContext>
  )
);
