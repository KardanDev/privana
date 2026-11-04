import { z } from "zod";
import { hasReadableAccent } from "./has-readable-accent";
import { isSafePlatformUrl } from "./is-safe-platform-url";
import type { CreatorDTO } from "./product";

const shortText = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .refine(
    (value) =>
      [...value].every(
        (character) =>
          character.charCodeAt(0) >= 32 && character.charCodeAt(0) !== 127
      ),
    "Use uma única linha de texto."
  );
const safeUrl = z
  .string()
  .trim()
  .max(2048)
  .refine(isSafePlatformUrl, "Use HTTPS ou um caminho local absoluto seguro.");
const linkSchema = z
  .object({
    href: safeUrl.refine((value) => value !== "", "Informe o destino do link."),
    label: shortText,
  })
  .strict();
export const platformConfigSchema = z
  .object({
    announcement: z
      .object({ href: safeUrl, text: z.string().trim().max(240) })
      .strict(),
    auth: z
      .object({
        description: z.string().trim().max(500),
        title: z.string().trim().min(1).max(120),
      })
      .strict(),
    brand: z
      .object({
        accentColor: z
          .string()
          .regex(/^#[0-9a-fA-F]{6}$/)
          .refine(
            hasReadableAccent,
            "A cor precisa ter contraste de 4,5:1 com branco."
          ),
        logoUrl: safeUrl,
        name: shortText,
        tagline: z.string().trim().max(160),
      })
      .strict(),
    discovery: z
      .object({
        categories: z
          .array(z.string().trim().min(1).max(60))
          .max(24)
          .refine(
            (values) =>
              new Set(values.map((value) => value.toLocaleLowerCase("pt-BR")))
                .size === values.length,
            "As categorias devem ser únicas."
          ),
        description: z.string().trim().max(500),
        featuredHandles: z
          .array(z.string().regex(/^[a-z0-9_-]{3,40}$/))
          .max(24)
          .refine(
            (values) => new Set(values).size === values.length,
            "Os perfis devem ser únicos."
          ),
        title: z.string().trim().min(1).max(120),
      })
      .strict(),
    features: z
      .object({
        creatorApplications: z.boolean(),
        messaging: z.boolean(),
        registration: z.boolean(),
      })
      .strict(),
    footer: z
      .object({
        links: z.array(linkSchema).max(12),
        supportEmail: z.union([z.literal(""), z.email().max(254)]),
        text: z.string().trim().max(500),
      })
      .strict(),
    navigation: z
      .object({
        explore: shortText,
        home: shortText,
        memberships: shortText,
        messages: shortText,
        saved: shortText,
        studio: shortText,
      })
      .strict(),
    pages: z
      .array(
        z
          .object({
            body: z.string().trim().min(1).max(20_000),
            slug: z
              .string()
              .max(80)
              .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
            title: z.string().trim().min(1).max(120),
          })
          .strict()
      )
      .max(20)
      .refine(
        (pages) =>
          new Set(pages.map((page) => page.slug)).size === pages.length,
        "Os endereços das páginas devem ser únicos."
      ),
  })
  .strict();

export type PlatformConfig = z.infer<typeof platformConfigSchema>;
export const defaultPlatformConfig: PlatformConfig = {
  announcement: { href: "", text: "" },
  auth: {
    description: "Acompanhe criadores e participe de conversas que importam.",
    title: "Entre na sua comunidade",
  },
  brand: {
    accentColor: "#6D28D9",
    logoUrl: "",
    name: "Privana",
    tagline: "Perto de quem cria.",
  },
  discovery: {
    categories: [
      "Fotografia",
      "Arte",
      "Estilo de vida",
      "Música",
      "Fitness",
      "Gastronomia",
    ],
    description: "Encontre pessoas e conteúdo que combinam com você.",
    featuredHandles: [],
    title: "Descubra criadores",
  },
  features: { creatorApplications: true, messaging: true, registration: true },
  footer: {
    links: [],
    supportEmail: "",
    text: "Privana · Uma comunidade para criadores e seus membros.",
  },
  navigation: {
    explore: "Explorar",
    home: "Início",
    memberships: "Assinaturas",
    messages: "Mensagens",
    saved: "Salvos",
    studio: "Estúdio",
  },
  pages: [],
};

export interface CmsDocumentDTO {
  draft: PlatformConfig;
  published: PlatformConfig;
  publishedAt: string | null;
  version: number;
}
export interface CmsRevisionDTO {
  id: string;
  publishedAt: string;
  publisherId: string;
  publisherName: string;
  version: number;
}
export type TeamRole = "member" | "editor" | "moderator" | "analyst";
export interface OperationsPageDTO<T> {
  hasMore: boolean;
  items: T[];
  page: number;
  total: number;
}
export interface OperationsUserDTO {
  createdAt: string;
  creatorId: string | null;
  email: string;
  emailVerified: boolean;
  id: string;
  name: string;
  role: string;
  status: string;
}
export interface OperationsSubscriptionDTO {
  createdAt: string;
  creatorId: string;
  creatorName: string;
  expiresAt: string;
  id: string;
  status: string;
  userEmail: string;
  userId: string;
  userName: string;
}
export interface OperationsTransactionDTO {
  amountMinor: number;
  createdAt: string;
  creatorId: string | null;
  creatorName: string | null;
  currency: string;
  externalId: string;
  id: string;
  kind: string;
  occurredAt: string;
  provider: string;
  status: string;
  subscriptionId: string | null;
  userId: string | null;
  userName: string | null;
}
export interface OperationsReportDTO {
  createdAt: string;
  creatorId: string | null;
  id: string;
  postId: string | null;
  reason: string;
  reporterId: string;
  resolvedAt: string | null;
  status: string;
}
export interface OperationsAuditDTO {
  action: string;
  actorId: string;
  actorName: string;
  createdAt: string;
  id: string;
  targetId: string;
}
export interface AnalyticsCurrencyDTO {
  currency: string;
  failedMinor: number;
  pendingMinor: number;
  receivedMinor: number;
  refundedMinor: number;
  transactionCount: number;
}
export interface AnalyticsDTO {
  currencies: AnalyticsCurrencyDTO[];
  daily: {
    date: string;
    users: number;
    posts: number;
    subscriptions: number;
    transactions: number;
  }[];
  days: number;
  totals: {
    users: number;
    creators: number;
    pendingCreators: number;
    posts: number;
    activeSubscriptions: number;
    openReports: number;
  };
}
export type OperationsCreatorDTO = CreatorDTO;
