import type { client } from "@/utils/orpc";

export type AdminOverview = Awaited<ReturnType<typeof client.admin.overview>>;
export interface StatusCommand {
  id: string;
  kind: "creator" | "user";
  name: string;
  status: "ACTIVE" | "SUSPENDED";
}
export type AdminCommand =
  | StatusCommand
  | {
      id: string;
      kind: "report";
      name: string;
      status: "RESOLVED" | "DISMISSED";
    };
export interface AdminActionProps {
  onAction: (command: AdminCommand) => void;
  pending: boolean;
}
