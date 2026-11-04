import { client } from "@/utils/orpc";
import type { AdminCommand } from "./admin-types";

export async function executeAdminCommand(command: AdminCommand) {
  if (command.kind === "report") {
    return await client.admin.resolveReport({
      id: command.id,
      status: command.status,
    });
  }
  if (command.kind === "creator") {
    return await client.admin.setCreatorStatus({
      id: command.id,
      status: command.status,
    });
  }
  return await client.admin.setUserStatus({
    id: command.id,
    status: command.status,
  });
}
