import type { client } from "@/utils/orpc";

export type OperationsListSection =
  | "users"
  | "creators"
  | "reports"
  | "audits"
  | "subscriptions"
  | "transactions";
export interface OperationsFilters {
  currency: string;
  kind: string;
  page: number;
  role: string;
  search: string;
  status: string;
}
export type OperationsResult =
  | {
      section: "users";
      data: Awaited<ReturnType<typeof client.admin.operations.users>>;
    }
  | {
      section: "creators";
      data: Awaited<ReturnType<typeof client.admin.operations.creators>>;
    }
  | {
      section: "reports";
      data: Awaited<ReturnType<typeof client.admin.operations.reports>>;
    }
  | {
      section: "audits";
      data: Awaited<ReturnType<typeof client.admin.operations.audits>>;
    }
  | {
      section: "subscriptions";
      data: Awaited<ReturnType<typeof client.admin.operations.subscriptions>>;
    }
  | {
      section: "transactions";
      data: Awaited<ReturnType<typeof client.admin.operations.transactions>>;
    };
