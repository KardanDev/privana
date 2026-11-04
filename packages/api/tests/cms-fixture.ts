import type { Database } from "@privana/db";
import type { Context } from "../src/context";
import type { PlatformConfig } from "../src/contracts/platform";
import { defaultPlatformConfig } from "../src/contracts/platform";

interface CmsRecord {
  draft: PlatformConfig;
  id: string;
  published: PlatformConfig;
  publishedAt: Date | null;
  updatedAt: Date;
  version: number;
}
interface Revision {
  config: PlatformConfig;
  id: string;
  publishedAt: Date;
  publisherId: string;
  version: number;
}
export function createCmsFixture(role = "editor", status = "ACTIVE") {
  let document: CmsRecord | null = null;
  const audits: unknown[] = [];
  const revisions: Revision[] = [];
  let loseCas = false;
  const db = {
    $transaction: async <T>(work: (tx: Database) => Promise<T>): Promise<T> => {
      const snapshot = structuredClone(document);
      const auditCount = audits.length;
      const revisionCount = revisions.length;
      try {
        return await work(db as unknown as Database);
      } catch (error) {
        document = snapshot;
        audits.splice(auditCount);
        revisions.splice(revisionCount);
        throw error;
      }
    },
    auditEvent: {
      create: ({ data }: { data: unknown }) => {
        audits.push(data);
        return data;
      },
    },
    platformRevision: {
      create: ({ data }: { data: Omit<Revision, "id"> }) => {
        const revision = { ...data, id: `revision-${revisions.length + 1}` };
        revisions.push(revision);
        return revision;
      },
      findMany: () =>
        revisions
          .map((revision) => ({ ...revision, publisher: { name: "Team" } }))
          .reverse(),
      findUnique: ({ where }: { where: { id: string } }) =>
        revisions.find((revision) => revision.id === where.id),
    },
    platformSettings: {
      createMany: () => {
        if (!document) {
          document = {
            draft: structuredClone(defaultPlatformConfig),
            id: "platform",
            published: structuredClone(defaultPlatformConfig),
            publishedAt: null,
            updatedAt: new Date(),
            version: 0,
          };
        }
        return { count: 1 };
      },
      findUnique: () => document,
      findUniqueOrThrow: () => {
        if (!document) {
          throw new Error("No document");
        }
        return document;
      },
      updateMany: ({
        where,
        data,
      }: {
        where: { version: number };
        data: {
          draft?: PlatformConfig;
          published?: PlatformConfig;
          publishedAt?: Date;
        };
      }) => {
        if (loseCas || !document || document.version !== where.version) {
          return { count: 0 };
        }
        document = { ...document, ...data, version: document.version + 1 };
        return { count: 1 };
      },
    },
    user: {
      findUnique: () => ({
        emailVerified: true,
        id: "team",
        name: "Team",
        role,
        status,
      }),
    },
  };
  const context: Context = {
    db: db as unknown as Database,
    session: {
      user: { id: "team", role: "admin" },
    } as unknown as Context["session"],
  };
  return {
    audits,
    context,
    getDocument: () => document,
    loseCas: () => {
      loseCas = true;
    },
    revisions,
  };
}
