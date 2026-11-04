import { z } from "zod";
import { adminProcedure } from "../../index";
import { serializeCreator } from "../creators/serialize-creator";
import { creatorInclude } from "../shared/query-shapes";

const pageSize = 50;

export const adminOverview = adminProcedure
  .input(
    z
      .object({
        page: z.number().int().min(0).max(10_000).default(0),
        search: z.string().trim().max(200).optional(),
      })
      .optional()
  )
  .handler(async ({ context, input }) => {
    const page = input?.page ?? 0;
    const search = input?.search;
    const pagination = { skip: page * pageSize, take: pageSize + 1 };
    const [userCount, creatorCount, pendingCreatorCount, openReportCount] =
      await Promise.all([
        context.db.user.count(),
        context.db.creatorProfile.count(),
        context.db.creatorProfile.count({ where: { status: "PENDING" } }),
        context.db.report.count({ where: { status: "OPEN" } }),
      ]);
    const [creators, users, reports, audits] = await Promise.all([
      context.db.creatorProfile.findMany({
        include: creatorInclude,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        ...pagination,
        where: search
          ? {
              OR: [
                { displayName: { contains: search, mode: "insensitive" } },
                { handle: { contains: search, mode: "insensitive" } },
              ],
            }
          : undefined,
      }),
      context.db.user.findMany({
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          createdAt: true,
          email: true,
          id: true,
          name: true,
          role: true,
          status: true,
        },
        ...pagination,
        where: search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            }
          : undefined,
      }),
      context.db.report.findMany({
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        ...pagination,
        where: search
          ? {
              OR: [
                { reason: { contains: search, mode: "insensitive" } },
                { id: { contains: search, mode: "insensitive" } },
              ],
            }
          : undefined,
      }),
      context.db.auditEvent.findMany({
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          action: true,
          actorId: true,
          createdAt: true,
          id: true,
          targetId: true,
        },
        ...pagination,
        where: search
          ? {
              OR: [
                { action: { contains: search, mode: "insensitive" } },
                { targetId: { contains: search, mode: "insensitive" } },
              ],
            }
          : undefined,
      }),
    ]);
    const hasMoreBySection = {
      audits: audits.length > pageSize,
      creators: creators.length > pageSize,
      reports: reports.length > pageSize,
      users: users.length > pageSize,
    };
    return {
      audits: audits.slice(0, pageSize).map((row) => ({
        ...row,
        createdAt: row.createdAt.toISOString(),
      })),
      creators: await Promise.all(
        creators
          .slice(0, pageSize)
          .map((row) => serializeCreator(context.db, row))
      ),
      metrics: {
        creators: creatorCount,
        openReports: openReportCount,
        pendingCreators: pendingCreatorCount,
        users: userCount,
      },
      pagination: {
        hasMore: Object.values(hasMoreBySection).some(Boolean),
        hasMoreBySection,
        page,
      },
      reports: reports.slice(0, pageSize).map((row) => ({
        ...row,
        createdAt: row.createdAt.toISOString(),
        resolvedAt: row.resolvedAt?.toISOString() ?? null,
      })),
      users: users.slice(0, pageSize).map((row) => ({
        ...row,
        createdAt: row.createdAt.toISOString(),
      })),
    };
  });
