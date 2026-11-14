import { defaultPlatformConfig } from "@privana/api/contracts/platform";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToStaticMarkup } from "react-dom/server";
import { operationsNavigation } from "../../src/domains/admin/operations-navigation";
import { OperationsShell } from "../../src/domains/admin/operations-shell";
import { StudioScreen } from "../../src/domains/studio/studio-screen";
import { PlatformContext } from "../../src/shared/platform/platform-context";
import { orpc } from "../../src/utils/orpc";
import { creator, studio } from "../studio/studio-fixtures";

const [, , workspace = "owner", role = "admin", flags = ""] = process.argv;
const config = {
  ...defaultPlatformConfig,
  brand: {
    ...defaultPlatformConfig.brand,
    name: flags.includes("long") ? "Privana".repeat(10) : "Privana",
  },
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, staleTime: Number.POSITIVE_INFINITY },
  },
});
queryClient.setQueryData(
  [...orpc.studio.overview.key(), { status: "ACTIVE" }],
  {
    pageParams: [undefined],
    pages: [
      {
        ...studio.pages[0],
        nextCursor: null,
        posts: [],
        profile: {
          ...creator,
          status: role === "pending" ? "PENDING" : "ACTIVE",
        },
      },
    ],
  }
);
const ignoreStaticAction = () => {
  /* Static component review performs no operations. */
};
const section =
  operationsNavigation.find((item) =>
    item.roles.some((value) => value === role)
  )?.id ?? "overview";
process.stdout.write(
  renderToStaticMarkup(
    <PlatformContext value={config}>
      <QueryClientProvider client={queryClient}>
        {workspace === "studio" ? (
          <main
            className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8"
            id="main-content"
          >
            <StudioScreen />
          </main>
        ) : (
          <OperationsShell
            onSelect={ignoreStaticAction}
            section={section}
            viewerName={
              flags.includes("long") ? "Equipe".repeat(14) : "Equipe fictícia"
            }
            viewerRole={role}
          >
            <p>Revisão fictícia do shell; nenhuma conta ou operação real.</p>
          </OperationsShell>
        )}
      </QueryClientProvider>
    </PlatformContext>
  )
);
