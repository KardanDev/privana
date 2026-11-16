import { defaultPlatformConfig } from "@privana/api/contracts/platform";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import { StudioScreen } from "../../src/domains/studio/studio-screen";
import { PlatformContext } from "../../src/shared/platform/platform-context";
import { StudioPostsReview } from "./studio-posts-review";

const root = document.getElementById("studio-review");
if (!root) {
  throw new Error("The Studio fixture needs a mount point.");
}
const client = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});
const refresh = () => client.invalidateQueries();
createRoot(root).render(
  <QueryClientProvider client={client}>
    <PlatformContext value={defaultPlatformConfig}>
      {root.dataset.mode === "context" ? (
        <main className="mx-auto max-w-5xl p-4">
          <button onClick={refresh} type="button">
            Atualizar dados fictícios
          </button>
          <StudioScreen />
        </main>
      ) : (
        <StudioPostsReview mode={root.dataset.mode ?? "new"} />
      )}
      <Toaster />
    </PlatformContext>
  </QueryClientProvider>
);
