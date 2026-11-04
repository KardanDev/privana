import type { PlatformConfig } from "@privana/api/contracts/platform";
import { client } from "@/utils/orpc";

export type CmsCommand =
  | { kind: "save"; config: PlatformConfig; expectedVersion: number }
  | { kind: "publish"; expectedVersion: number }
  | { kind: "restore"; revisionId: string; expectedVersion: number };

export async function executeCmsCommand(command: CmsCommand) {
  if (command.kind === "save") {
    return await client.admin.cms.saveDraft({
      config: command.config,
      expectedVersion: command.expectedVersion,
    });
  }
  if (command.kind === "restore") {
    return await client.admin.cms.restoreDraft({
      expectedVersion: command.expectedVersion,
      revisionId: command.revisionId,
    });
  }
  return await client.admin.cms.publish({
    expectedVersion: command.expectedVersion,
  });
}
