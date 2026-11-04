import { client } from "@/utils/orpc";
import type {
  OperationsFilters,
  OperationsListSection,
  OperationsResult,
} from "./operations-types";

export async function readOperations(
  section: OperationsListSection,
  filters: OperationsFilters
): Promise<OperationsResult> {
  const input = { page: filters.page, search: filters.search || undefined };
  if (section === "users") {
    return {
      data: await client.admin.operations.users({
        ...input,
        role: filters.role || undefined,
        status: filters.status || undefined,
      }),
      section,
    };
  }
  if (section === "creators") {
    return {
      data: await client.admin.operations.creators({
        ...input,
        status: filters.status || undefined,
      }),
      section,
    };
  }
  if (section === "reports") {
    return {
      data: await client.admin.operations.reports({
        ...input,
        status: filters.status || undefined,
      }),
      section,
    };
  }
  if (section === "subscriptions") {
    return {
      data: await client.admin.operations.subscriptions({
        ...input,
        status: filters.status || undefined,
      }),
      section,
    };
  }
  if (section === "transactions") {
    return {
      data: await client.admin.operations.transactions({
        ...input,
        currency: filters.currency || undefined,
        kind:
          filters.kind === "CHARGE" || filters.kind === "REFUND"
            ? filters.kind
            : undefined,
        status: filters.status || undefined,
      }),
      section,
    };
  }
  return { data: await client.admin.operations.audits(input), section };
}
