import type { Page } from "@playwright/test";

const READ_ONLY_API_PATHS = new Set([
  "/api/auth/get-session",
  "/api/rpc/viewer/get",
  "/api/rpc/platform/get",
]);

export async function protectAnonymousPage(
  page: Page,
  origin: string
): Promise<string[]> {
  const blockedRequests: string[] = [];
  await page.route("**/*", async (route) => {
    const request = route.request();
    const target = new URL(request.url());
    const method = request.method();
    const readOnly = method === "GET" || method === "HEAD";
    const allowedReadQuery =
      ["/api/rpc/viewer/get", "/api/rpc/platform/get"].includes(
        target.pathname
      ) && method === "POST";
    const allowedApi =
      !target.pathname.startsWith("/api/") ||
      READ_ONLY_API_PATHS.has(target.pathname);
    if (
      target.origin !== origin ||
      !(readOnly || allowedReadQuery) ||
      !allowedApi
    ) {
      blockedRequests.push(`${method} ${target.pathname}`);
      await route.abort("blockedbyclient");
      return;
    }
    await route.continue();
  });
  return blockedRequests;
}
