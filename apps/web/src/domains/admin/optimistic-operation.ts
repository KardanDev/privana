import type { QueryClient, QueryKey } from "@tanstack/react-query";
import {
  type OperationsPatch,
  patchOperationsResult,
} from "./operations-patch";
import type { OperationsResult } from "./operations-types";

interface OperationsRollback {
  key: QueryKey;
  patch: OperationsPatch;
}

export async function optimisticOperation(
  queryClient: QueryClient,
  patch: OperationsPatch
): Promise<OperationsRollback[]> {
  const queryKey = ["admin-operations", patch.section];
  await queryClient.cancelQueries({ queryKey });
  const rollback: OperationsRollback[] = [];
  for (const [key, result] of queryClient.getQueriesData<OperationsResult>({
    queryKey,
  })) {
    if (!result) {
      continue;
    }
    const item = result.data.items.find((row) => row.id === patch.id);
    if (!item) {
      continue;
    }
    const previous: unknown = Reflect.get(item, patch.field);
    if (typeof previous !== "string") {
      continue;
    }
    rollback.push({ key, patch: { ...patch, value: previous } });
    queryClient.setQueryData(key, patchOperationsResult(result, patch));
  }
  return rollback;
}
