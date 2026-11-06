import type { QueryClient } from "@tanstack/react-query";
import { patchOperationsResult } from "./operations-patch";
import type { OperationsResult } from "./operations-types";
import type { optimisticOperation } from "./optimistic-operation";

export function rollbackOperation(
  queryClient: QueryClient,
  rollback: Awaited<ReturnType<typeof optimisticOperation>> | undefined
): void {
  for (const { key, patch } of rollback ?? []) {
    queryClient.setQueryData<OperationsResult>(key, (current) =>
      current ? patchOperationsResult(current, patch) : current
    );
  }
}
