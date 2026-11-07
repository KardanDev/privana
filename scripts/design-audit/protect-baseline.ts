import type { BrowserContext } from "@playwright/test";

const readQueries = new Set([
  "viewer/get",
  "platform/get",
  "feed/list",
  "creators/get",
  "creators/list",
  "memberships/list",
  "messages/list",
  "messages/get",
  "notifications/list",
  "settings/get",
  "studio/overview",
  "posts/comments",
  "admin/overview",
  "admin/analytics/overview",
  "admin/cms/get",
  "admin/cms/history",
  "admin/operations/users",
  "admin/operations/creators",
  "admin/operations/reports",
  "admin/operations/subscriptions",
  "admin/operations/transactions",
  "admin/operations/audits",
  "admin/reportDetails",
]);

export async function protectBaseline(
  context: BrowserContext,
  origin: string,
  blocked: string[]
): Promise<void> {
  await context.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const read = request.method() === "GET" || request.method() === "HEAD";
    const query =
      url.origin === origin &&
      url.pathname.startsWith("/api/rpc/") &&
      readQueries.has(url.pathname.slice("/api/rpc/".length));
    if (read || (request.method() === "POST" && query)) {
      await route.continue();
      return;
    }
    blocked.push(`${request.method()} ${url.pathname}`);
    await route.abort("blockedbyclient");
  });
}
