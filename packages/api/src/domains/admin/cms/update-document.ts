import { ORPCError } from "@orpc/server";
import type { Database } from "@privana/db";
import type { PlatformConfig } from "../../../contracts/platform";
import {
  defaultPlatformConfig,
  platformConfigSchema,
} from "../../../contracts/platform";
import { serializeCmsDocument } from "./serialize-document";

type CmsMutation =
  | { kind: "save"; config: PlatformConfig }
  | { kind: "publish" }
  | { kind: "restore"; revisionId: string };
export async function updateCmsDocument(
  db: Database,
  actorId: string,
  expectedVersion: number,
  mutation: CmsMutation
) {
  return await db.$transaction(async (tx) => {
    await tx.platformSettings.createMany({
      data: [
        {
          draft: defaultPlatformConfig,
          id: "platform",
          published: defaultPlatformConfig,
        },
      ],
      skipDuplicates: true,
    });
    const document = await tx.platformSettings.findUniqueOrThrow({
      where: { id: "platform" },
    });
    if (document.version !== expectedVersion) {
      throw new ORPCError("CONFLICT", {
        message: "A configuração mudou. Recarregue antes de salvar.",
      });
    }
    let config = platformConfigSchema.parse(document.draft);
    if (mutation.kind === "save") {
      ({ config } = mutation);
    }
    if (mutation.kind === "restore") {
      const revision = await tx.platformRevision.findUnique({
        where: { id: mutation.revisionId },
      });
      if (!revision) {
        throw new ORPCError("NOT_FOUND", {
          message: "Revisão não encontrada.",
        });
      }
      config = platformConfigSchema.parse(revision.config);
    }
    const publishedAt = new Date();
    const data =
      mutation.kind === "publish"
        ? { published: config, publishedAt, version: { increment: 1 } }
        : { draft: config, version: { increment: 1 } };
    const changed = await tx.platformSettings.updateMany({
      data,
      where: { id: "platform", version: expectedVersion },
    });
    if (changed.count !== 1) {
      throw new ORPCError("CONFLICT", {
        message:
          "Outra pessoa salvou esta configuração. Recarregue e tente novamente.",
      });
    }
    if (mutation.kind === "publish") {
      await tx.platformRevision.create({
        data: {
          config,
          publishedAt,
          publisherId: actorId,
          version: expectedVersion + 1,
        },
      });
    }
    const actions = {
      publish: "CMS_PUBLISHED",
      restore: "CMS_DRAFT_RESTORED",
      save: "CMS_DRAFT_SAVED",
    } as const;
    await tx.auditEvent.create({
      data: {
        action: actions[mutation.kind],
        actorId,
        metadata: {
          version: expectedVersion + 1,
          ...(mutation.kind === "restore"
            ? { revisionId: mutation.revisionId }
            : {}),
        },
        targetId: "platform",
      },
    });
    return serializeCmsDocument(
      await tx.platformSettings.findUniqueOrThrow({ where: { id: "platform" } })
    );
  });
}
