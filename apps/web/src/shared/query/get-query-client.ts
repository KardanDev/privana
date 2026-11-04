import { environmentManager, type QueryClient } from "@tanstack/react-query";
import { createQueryClient } from "./create-query-client";

let browserQueryClient: QueryClient | undefined;
export function getQueryClient() {
  if (environmentManager.isServer()) {
    return createQueryClient();
  }
  browserQueryClient ??= createQueryClient();
  return browserQueryClient;
}
