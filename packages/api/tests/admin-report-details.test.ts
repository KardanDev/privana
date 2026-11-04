import { expect, mock, test } from "bun:test";
import { call } from "@orpc/server";
import type { Database } from "@privana/db";
import type { Context } from "../src/context";
import { authorizePostMedia } from "../src/domains/access/authorize-post-media";
import { reportDetails } from "../src/domains/admin/report-details";

const createdAt = new Date("2026-10-24T12:00:00Z");
const createFixture = (role = "admin", status = "ACTIVE") => {
  const creator = {
    bio: "Creator context",
    category: "Arte",
    displayName: "Alice",
    handle: "alice",
    id: "alice-profile",
    location: "Brasil",
    status: "SUSPENDED",
    user: { status: "ACTIVE" },
    userId: "alice",
  };
  const post = {
    body: "PRIVATE ARCHIVED BODY",
    createdAt,
    creator,
    excerpt: "Preview",
    id: "private-post",
    mediaKey: "alice/private-secret.mp4",
    mediaType: "video/mp4",
    status: "ARCHIVED",
    title: "Reported title",
    visibility: "SUBSCRIBERS",
  };
  const report = {
    createdAt,
    creator: null as typeof creator | null,
    id: "report-1",
    post: post as typeof post | null,
    reason: "Please review",
    reporterId: "member",
    resolvedAt: null,
    status: "OPEN",
  };
  const reportRows = mock((_input: unknown) => report as typeof report | null);
  const reportedMedia = mock(
    (_input: unknown) => ({ id: report.id }) as { id: string } | null
  );
  const context: Context = {
    db: {
      post: { findUnique: () => post },
      report: { findFirst: reportedMedia, findUnique: reportRows },
      subscription: { findUnique: () => null },
      user: { findUnique: () => ({ id: "owner", role, status }) },
    } as unknown as Database,
    session: { user: { id: "owner" } } as Context["session"],
  };
  return { context, creator, post, report, reportedMedia, reportRows };
};

test("current admin can inspect archived premium content without exposing storage keys", async () => {
  const fixture = createFixture();
  const result = await call(
    reportDetails,
    { id: fixture.report.id },
    { context: fixture.context }
  );
  expect(result.post?.body).toBe("PRIVATE ARCHIVED BODY");
  expect(result.post?.status).toBe("ARCHIVED");
  expect(result.post?.mediaUrl).toBe("/api/media/private-post");
  expect(result.creator?.handle).toBe("alice");
  expect(result.creator?.status).toBe("SUSPENDED");
  expect(JSON.stringify(result)).not.toContain("private-secret.mp4");
  expect(JSON.stringify(result)).not.toContain("mediaKey");
  const media = await authorizePostMedia(
    fixture.context.db,
    fixture.post.id,
    "owner"
  );
  expect(media.key).toBe(fixture.post.mediaKey);
});

test.each([
  ["member", "ACTIVE", "FORBIDDEN"],
  ["admin", "SUSPENDED", "UNAUTHORIZED"],
])(
  "report details denies %s/%s before fetching target content",
  async (role, status, code) => {
    const fixture = createFixture(role, status);
    await expect(
      call(
        reportDetails,
        { id: fixture.report.id },
        { context: fixture.context }
      )
    ).rejects.toMatchObject({ code });
    expect(fixture.reportRows).not.toHaveBeenCalled();
    await expect(
      authorizePostMedia(fixture.context.db, fixture.post.id, "owner")
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  }
);

test("anonymous report detail requests are rejected", async () => {
  const fixture = createFixture();
  await expect(
    call(
      reportDetails,
      { id: fixture.report.id },
      { context: { ...fixture.context, session: null } }
    )
  ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  expect(fixture.reportRows).not.toHaveBeenCalled();
});

test("creator-only reports retain review context when a post is unavailable", async () => {
  const fixture = createFixture();
  fixture.report.creator = fixture.creator;
  fixture.report.post = null;
  const result = await call(
    reportDetails,
    { id: fixture.report.id },
    { context: fixture.context }
  );
  expect(result.creator?.bio).toBe("Creator context");
  expect(result.post).toBeNull();
});

test("missing reports return a useful not-found error", async () => {
  const fixture = createFixture();
  fixture.reportRows.mockReturnValue(null);
  await expect(
    call(reportDetails, { id: "missing" }, { context: fixture.context })
  ).rejects.toMatchObject({ code: "NOT_FOUND" });
});

test("an active moderator can inspect media attached to a reported private post", async () => {
  const fixture = createFixture("moderator");
  const result = await call(
    reportDetails,
    { id: fixture.report.id },
    { context: fixture.context }
  );
  expect(result.post?.mediaUrl).toBe("/api/media/private-post");
  const media = await authorizePostMedia(
    fixture.context.db,
    fixture.post.id,
    "owner"
  );
  expect(media.key).toBe(fixture.post.mediaKey);
  expect(fixture.reportedMedia).toHaveBeenCalledWith({
    select: { id: true },
    where: { postId: fixture.post.id },
  });
});

test("moderator access does not extend to unreported premium media", async () => {
  const fixture = createFixture("moderator");
  fixture.reportedMedia.mockReturnValue(null);
  await expect(
    authorizePostMedia(fixture.context.db, fixture.post.id, "owner")
  ).rejects.toMatchObject({ code: "FORBIDDEN" });
});

test.each([
  ["moderator", "SUSPENDED"],
  ["member", "ACTIVE"],
  ["editor", "ACTIVE"],
  ["analyst", "ACTIVE"],
])("a report grants no media access to %s/%s", async (role, status) => {
  const fixture = createFixture(role, status);
  await expect(
    authorizePostMedia(fixture.context.db, fixture.post.id, "owner")
  ).rejects.toMatchObject({ code: "FORBIDDEN" });
  expect(fixture.reportedMedia).not.toHaveBeenCalled();
});
