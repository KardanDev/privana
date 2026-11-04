import type { PlatformSettings } from "@privana/db/client";
import type { CmsDocumentDTO } from "../../../contracts/platform";
import {
  defaultPlatformConfig,
  platformConfigSchema,
} from "../../../contracts/platform";
export function serializeCmsDocument(
  document: PlatformSettings | null
): CmsDocumentDTO {
  return {
    draft: platformConfigSchema.parse(document?.draft ?? defaultPlatformConfig),
    published: platformConfigSchema.parse(
      document?.published ?? defaultPlatformConfig
    ),
    publishedAt: document?.publishedAt?.toISOString() ?? null,
    version: document?.version ?? 0,
  };
}
