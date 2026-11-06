import { z } from "zod";
export const pageInput = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(24).default(12),
});
export const publicCreatorWhere = {
  status: "ACTIVE",
  user: { status: "ACTIVE" },
} as const;
export const publicPostWhere = {
  creator: publicCreatorWhere,
  status: "PUBLISHED",
} as const;
export const creatorInclude = {
  _count: {
    select: { followers: true, posts: { where: { status: "PUBLISHED" } } },
  },
} as const;
export const postInclude = {
  _count: { select: { bookmarks: true, comments: true, likes: true } },
  creator: { include: creatorInclude },
} as const;
export const publicUrl = z
  .url()
  .max(2048)
  .refine((value) => value.startsWith("https://"), "Utilize uma URL HTTPS.")
  .nullable()
  .optional();
export const profileInput = z.object({
  avatarUrl: publicUrl,
  bio: z.string().trim().max(2000),
  category: z.string().trim().min(2).max(60),
  coverUrl: publicUrl,
  displayName: z.string().trim().min(2).max(80),
  handle: z
    .string()
    .trim()
    .min(3)
    .max(40)
    .regex(/^[a-z0-9_-]+$/),
  location: z.string().trim().max(120),
  monthlyPriceCents: z.number().int().min(0).max(1_000_000),
});
export const postInput = z.object({
  body: z.string().trim().min(1).max(50_000),
  clientPostId: z
    .uuid()
    .transform((id) => id.toLowerCase())
    .optional(),
  excerpt: z.string().trim().max(500),
  id: z.string().optional(),
  mediaKey: z
    .string()
    .regex(/^[a-zA-Z0-9/_-]+\.[a-zA-Z0-9]+$/)
    .max(512)
    .nullable()
    .optional(),
  mediaType: z
    .enum(["image/jpeg", "image/png", "image/webp", "video/mp4"])
    .nullable()
    .optional(),
  previewUrl: publicUrl,
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  title: z.string().trim().min(1).max(160),
  visibility: z.enum(["PUBLIC", "SUBSCRIBERS"]),
});
