import { z } from "zod";
export const operationsPageSize = 25;
export const operationsInput = z
  .object({
    page: z.number().int().min(0).max(10_000).default(0),
    search: z.string().trim().max(120).optional(),
  })
  .strict();
export const userStatusFilter = z
  .string()
  .refine((value) => ["ACTIVE", "SUSPENDED"].includes(value))
  .optional();
export const userRoleFilter = z
  .string()
  .refine((value) =>
    ["member", "creator", "admin", "editor", "moderator", "analyst"].includes(
      value
    )
  )
  .optional();
export const creatorStatusFilter = z
  .string()
  .refine((value) => ["ACTIVE", "PENDING", "SUSPENDED"].includes(value))
  .optional();
export const reportStatusFilter = z
  .string()
  .refine((value) => ["OPEN", "RESOLVED", "DISMISSED"].includes(value))
  .optional();
export const subscriptionStatusFilter = z
  .string()
  .refine((value) =>
    ["ACTIVE", "EXPIRED", "CANCELED", "REVOKED"].includes(value)
  )
  .optional();
export const transactionStatusFilter = z
  .string()
  .refine((value) => ["PENDING", "SUCCEEDED", "FAILED"].includes(value))
  .optional();
