import type {
  OperationsListSection,
  OperationsResult,
} from "./operations-types";

export interface OperationsPatch {
  field: "status" | "role";
  id: string;
  section: OperationsListSection;
  value: string;
}

export function patchOperationsResult(
  result: OperationsResult,
  patch: OperationsPatch
): OperationsResult {
  if (result.section !== patch.section) {
    return result;
  }
  if (result.section === "users") {
    return {
      ...result,
      data: {
        ...result.data,
        items: result.data.items.map((item) =>
          item.id === patch.id ? { ...item, [patch.field]: patch.value } : item
        ),
      },
    };
  }
  if (patch.field !== "status") {
    return result;
  }
  if (result.section === "creators") {
    return {
      ...result,
      data: {
        ...result.data,
        items: result.data.items.map((item) =>
          item.id === patch.id ? { ...item, status: patch.value } : item
        ),
      },
    };
  }
  if (result.section === "reports") {
    return {
      ...result,
      data: {
        ...result.data,
        items: result.data.items.map((item) =>
          item.id === patch.id ? { ...item, status: patch.value } : item
        ),
      },
    };
  }
  if (result.section === "subscriptions") {
    return {
      ...result,
      data: {
        ...result.data,
        items: result.data.items.map((item) =>
          item.id === patch.id ? { ...item, status: patch.value } : item
        ),
      },
    };
  }
  return result;
}
