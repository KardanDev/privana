import { defaultPlatformConfig } from "@privana/api/contracts/platform";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import { PlatformContext } from "../../src/shared/platform/platform-context";
import { MessagesReview } from "./messages-review";

const root = document.getElementById("message-review");
if (!root) {
  throw new Error("The message fixture needs a mount point.");
}
const client = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});
createRoot(root).render(
  <QueryClientProvider client={client}>
    <PlatformContext value={defaultPlatformConfig}>
      <MessagesReview />
      <Toaster />
    </PlatformContext>
  </QueryClientProvider>
);
