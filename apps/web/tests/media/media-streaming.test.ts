import { expect, test } from "bun:test";
import { ORPCError } from "@orpc/server";
import { handleMediaUpload } from "../../src/domains/media/handle-media-upload";
import { partialMediaLength } from "../../src/domains/media/partial-media-length";
import { prepareMediaUpload } from "../../src/domains/media/prepare-media-upload";
import { servePostMedia } from "../../src/domains/media/serve-post-media";
import type { PrivateMediaResult } from "../../src/domains/media/types";

const pathname = "creator-a/8bd645bc-6372-4db5-9d46-57fb2fbad974.mp4";
const OWNED_MP4 = /^creator-a\/[a-f0-9-]{36}\.mp4$/;

test("partial media lengths reject malformed ranges and mismatched authoritative sizes", () => {
  expect(partialMediaLength("bytes 10-19/100", 100)).toBe(10);
  for (const range of [
    null,
    "bytes 10-9/100",
    "bytes 0-100/100",
    "bytes 0-9/99",
    "bytes 0-9/*",
    "bytes 0-9/100,20-29/100",
  ]) {
    expect(() => partialMediaLength(range, 100)).toThrow();
  }
});

test("unsolicited partial responses cancel the storage stream without exposing bytes", async () => {
  let cancelled = false;
  const response = await servePostMedia(
    new Request("https://privana.test/api/media/post"),
    "post",
    {
      authorize: () => Promise.resolve({ key: pathname, type: "video/mp4" }),
      readBlob: () =>
        Promise.resolve({
          blob: { contentType: "video/mp4", pathname, size: 100 },
          headers: new Headers({ "content-range": "bytes 0-9/100" }),
          statusCode: 206,
          stream: new ReadableStream<Uint8Array>({
            cancel() {
              cancelled = true;
            },
          }),
        }),
      token: "configured",
    }
  );
  expect(response.status).toBe(502);
  expect(cancelled).toBe(true);
});

test("server chooses a unique owned path, rejects unsupported files and prevents client path selection", () => {
  const prepared = prepareMediaUpload(
    { size: 20, type: "video/mp4" },
    "creator-a"
  );
  expect(prepared.path).toMatch(OWNED_MP4);
  expect(prepared.metadata.owner).toBe("creator-a");
  expect(prepared.cache).toBe("no-store");
  expect(
    prepareMediaUpload({ size: 20, type: "video/mp4" }, "creator-a").path
  ).not.toBe(prepared.path);
  expect(() =>
    prepareMediaUpload({ size: 20, type: "text/html" }, "creator-a")
  ).toThrow();
  expect(() =>
    prepareMediaUpload({ size: 0, type: "video/mp4" }, "creator-a")
  ).toThrow();
  expect(() =>
    prepareMediaUpload(
      { size: 100 * 1024 * 1024 + 1, type: "video/mp4" },
      "creator-a"
    )
  ).toThrow();
});

test("upload authentication runs before the SDK or any storage request", async () => {
  const response = await handleMediaUpload(
    new Request("https://privana.test/api/media/upload", {
      body: JSON.stringify({ path: pathname, phase: "end" }),
      headers: {
        "content-type": "application/json",
        origin: "https://privana.test",
      },
      method: "POST",
    }),
    {
      authUrl: "https://privana.test",
      getActor: () => Promise.reject(new ORPCError("FORBIDDEN")),
      token: "test-only",
    }
  );
  expect(response.status).toBe(403);
});
const makeBlob = (
  headers = new Headers(),
  mime = "video/mp4"
): PrivateMediaResult => ({
  blob: {
    contentType: mime,
    pathname,
    size: headers.has("content-range") ? 10 : 5,
  },
  headers,
  statusCode: headers.has("content-range") ? 206 : 200,
  stream: new Blob(["video"]).stream(),
});

test("authorized delivery streams bytes with private no-store headers and no storage location", async () => {
  const response = await servePostMedia(
    new Request("https://privana.test/api/media/post"),
    "post",
    {
      authorize: () => Promise.resolve({ key: pathname, type: "video/mp4" }),
      readBlob: (_key, options) => {
        expect(options.token).toBe("configured");
        expect(options.signal).toBeInstanceOf(AbortSignal);
        return Promise.resolve(makeBlob());
      },
      token: "configured",
    }
  );
  expect(response.status).toBe(200);
  expect(response.headers.get("cache-control")).toContain("no-store");
  expect(response.headers.get("content-type")).toBe("video/mp4");
  expect(response.headers.get("x-content-type-options")).toBe("nosniff");
  expect(response.headers.get("location")).toBeNull();
  expect(await response.text()).toBe("video");
});

test("video range delivery forwards only the validated Range header and returns 206", async () => {
  const response = await servePostMedia(
    new Request("https://privana.test/api/media/post", {
      headers: { authorization: "untrusted", Range: "bytes=0-4" },
    }),
    "post",
    {
      authorize: () => Promise.resolve({ key: pathname, type: "video/mp4" }),
      readBlob: (_key, options) => {
        expect(options.range).toBe("bytes=0-4");
        return Promise.resolve(
          makeBlob(new Headers({ "content-range": "bytes 0-4/10" }))
        );
      },
      token: "configured",
    }
  );
  expect(response.status).toBe(206);
  expect(response.headers.get("content-range")).toBe("bytes 0-4/10");
  expect(await response.text()).toBe("video");
});

test("unsupported range syntax is rejected before storage access", async () => {
  let reads = 0;
  const response = await servePostMedia(
    new Request("https://privana.test/api/media/post", {
      headers: { Range: "bytes=0-4,6-8" },
    }),
    "post",
    {
      authorize: () => Promise.resolve({ key: pathname, type: "video/mp4" }),
      readBlob: () => {
        reads += 1;
        return Promise.resolve(null);
      },
      token: "configured",
    }
  );
  expect(response.status).toBe(416);
  expect(reads).toBe(0);
});

test("an unsatisfiable range from the installed SDK maps to 416", async () => {
  const response = await servePostMedia(
    new Request("https://privana.test/api/media/post", {
      headers: { Range: "bytes=100-" },
    }),
    "post",
    {
      authorize: () => Promise.resolve({ key: pathname, type: "video/mp4" }),
      readBlob: () =>
        Promise.reject(new ORPCError("RANGE_NOT_SATISFIABLE", { status: 416 })),
      token: "configured",
    }
  );
  expect(response.status).toBe(416);
});

test("delivery rejects mismatched MIME metadata before releasing the stream", async () => {
  const response = await servePostMedia(
    new Request("https://privana.test/api/media/post"),
    "post",
    {
      authorize: () => Promise.resolve({ key: pathname, type: "video/mp4" }),
      readBlob: () => Promise.resolve(makeBlob(new Headers(), "text/html")),
      token: "configured",
    }
  );
  expect(response.status).toBe(400);
  expect(await response.text()).not.toContain("video");
});
