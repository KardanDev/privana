import type { Page } from "@playwright/test";
import { getNavigationReviewViewer } from "../../apps/web/tests/fixtures/get-navigation-review-viewer";

type Stage = "put" | "end" | "complete" | "save";
export type MediaFailure = Stage | "json" | "key" | "type" | "owner";

export async function mockStudioMediaTransport(page: Page) {
  const state = {
    bytes: 0,
    completionRequests: [] as string[],
    events: [] as string[],
    failure: undefined as MediaFailure | undefined,
    hold: undefined as Stage | undefined,
    owner: "fictional-viewer",
    paths: [] as string[],
    release: undefined as (() => void) | undefined,
    saves: [] as Record<string, unknown>[],
    size: 0,
  };
  await page.route("**/api/rpc/viewer/get", (route) =>
    route.fulfill({
      body: JSON.stringify({
        json: { ...getNavigationReviewViewer("active"), id: state.owner },
      }),
      contentType: "application/json",
    })
  );
  await page.route("**/api/media/upload", async (route) => {
    const input = route.request().postDataJSON();
    state.events.push(input.phase);
    if (state.hold === input.phase) {
      await new Promise<void>((resolve) => {
        state.release = resolve;
      });
    }
    if (input.phase === "begin") {
      const path = `${state.failure === "owner" ? "other-owner" : state.owner}/media-${state.paths.length}.png`;
      state.paths.push(path);
      state.size = input.file.size;
      await route.fulfill({
        contentType: "application/json",
        json: {
          completionToken: path,
          path,
          protocol: 1,
          upload: {
            multipart: true,
            partSize: input.file.size,
            parts: [
              { n: 1, url: new URL("/__studio-storage", page.url()).href },
            ],
          },
        },
      });
      return;
    }
    await route.fulfill({
      contentType: "application/json",
      json: {
        blob: {
          contentType: "image/png",
          etag: "fictional-object",
          path: input.completionToken,
          size: state.size,
          uploadedAt: "2026-11-16T12:00:00Z",
        },
        data: {},
      },
      status: input.phase === "end" && state.failure !== "end" ? 200 : 400,
    });
  });
  await page.route("**/__studio-storage", async (route) => {
    state.events.push("put");
    state.bytes += route.request().postDataBuffer()?.length ?? 0;
    if (state.hold === "put") {
      await new Promise<void>((resolve) => {
        state.release = resolve;
      });
    }
    await route.fulfill({
      body: "",
      headers: { etag: "fictional-part" },
      status: state.failure === "put" ? 400 : 200,
    });
  });
  await page.route("**/api/media/complete", async (route) => {
    const { pathname } = route.request().postDataJSON();
    state.events.push("complete");
    if (state.hold === "complete") {
      await new Promise<void>((resolve) => {
        state.release = resolve;
      });
    }
    state.completionRequests.push(pathname);
    await route.fulfill({
      body:
        state.failure === "json"
          ? "unreadable reply"
          : JSON.stringify({
              error: "Não foi possível confirmar o envio do arquivo.",
              mediaKey: state.failure === "key" ? "wrong/path.png" : pathname,
              mediaType: state.failure === "type" ? "video/mp4" : "image/png",
            }),
      contentType: "application/json",
      status: state.failure === "complete" ? 403 : 200,
    });
  });
  await page.route("**/api/rpc/studio/savePost", async (route) => {
    const { json: input } = route.request().postDataJSON();
    state.events.push("save");
    state.saves.push(input);
    if (state.hold === "save") {
      await new Promise<void>((resolve) => {
        state.release = resolve;
      });
    }
    if (state.failure === "save") {
      await route.abort("failed");
      return;
    }
    await route.fulfill({
      contentType: "application/json",
      json: { json: { id: input.clientPostId } },
    });
  });
  return state;
}
