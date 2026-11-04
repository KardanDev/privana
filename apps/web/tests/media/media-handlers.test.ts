import { expect, test } from "bun:test";
import { ORPCError } from "@orpc/server";
import { completeMediaUpload } from "../../src/domains/media/complete-media-upload";
import { handleMediaUpload } from "../../src/domains/media/handle-media-upload";
import { servePostMedia } from "../../src/domains/media/serve-post-media";

const pathname = "creator-a/8bd645bc-6372-4db5-9d46-57fb2fbad974.png";

test("upload-control JSON is bounded before the SDK parses or signs it", async () => {
  const response = await handleMediaUpload(
    new Request("https://privana.test/api/media/upload", {
      body: JSON.stringify({ extra: "x".repeat(17_000), phase: "begin" }),
      headers: {
        "content-type": "application/json",
        origin: "https://privana.test",
      },
      method: "POST",
    }),
    {
      authUrl: "https://privana.test",
      getActor: () => Promise.resolve("creator-a"),
      token: "not-a-real-token",
    }
  );
  expect(response.status).toBe(413);
});
const request = () =>
  new Request("https://privana.test/api/media/complete", {
    body: JSON.stringify({ pathname }),
    headers: {
      "content-type": "application/json",
      origin: "https://privana.test",
    },
    method: "POST",
  });

test("finalize rejects unauthorized actors before querying storage", async () => {
  let reads = 0;
  const response = await completeMediaUpload(request(), {
    authUrl: "https://privana.test",
    getActor: () => Promise.reject(new ORPCError("FORBIDDEN")),
    readMetadata: () => {
      reads += 1;
      return Promise.reject(new Error("unexpected"));
    },
    saveAsset: () => Promise.reject(new Error("unexpected")),
    token: "configured",
  });
  expect(response.status).toBe(403);
  expect(reads).toBe(0);
});

test("finalize records authoritative metadata and returns no storage URL", async () => {
  const writes: unknown[] = [];
  const response = await completeMediaUpload(request(), {
    authUrl: "https://privana.test",
    getActor: () => Promise.resolve("creator-a"),
    readMetadata: () =>
      Promise.resolve({ contentType: "image/png", pathname, size: 120 }),
    saveAsset: (asset) => {
      writes.push(asset);
      return Promise.resolve();
    },
    token: "configured",
  });
  expect(response.status).toBe(200);
  expect(writes).toEqual([
    {
      key: pathname,
      mimeType: "image/png",
      sizeBytes: 120,
      userId: "creator-a",
    },
  ]);
  expect(await response.json()).toEqual({
    mediaKey: pathname,
    mediaType: "image/png",
  });
});

test("finalize rejects content-type mismatches without creating assets", async () => {
  let writes = 0;
  const response = await completeMediaUpload(request(), {
    authUrl: "https://privana.test",
    getActor: () => Promise.resolve("creator-a"),
    readMetadata: () =>
      Promise.resolve({ contentType: "text/html", pathname, size: 120 }),
    saveAsset: () => {
      writes += 1;
      return Promise.resolve();
    },
    token: "configured",
  });
  expect(response.status).toBe(400);
  expect(writes).toBe(0);
});

test("media access denial happens before any blob read", async () => {
  let reads = 0;
  const response = await servePostMedia(
    new Request("https://privana.test/api/media/post"),
    "post",
    {
      authorize: () => Promise.reject(new ORPCError("FORBIDDEN")),
      readBlob: () => {
        reads += 1;
        return Promise.resolve(null);
      },
      token: "configured",
    }
  );
  expect(response.status).toBe(403);
  expect(reads).toBe(0);
});

test("missing storage gives a useful unavailable response", async () => {
  const response = await handleMediaUpload(request(), {
    authUrl: "https://privana.test",
    getActor: () => Promise.resolve("creator-a"),
  });
  expect(response.status).toBe(503);
  expect(await response.json()).toEqual({
    error: "O envio de arquivos ainda não está disponível.",
  });
});

test("every upload phase requires the configured browser origin", async () => {
  let authenticated = false;
  const response = await handleMediaUpload(
    new Request("https://privana.test/api/media/upload", {
      body: JSON.stringify({
        payload: {
          blob: {
            contentDisposition: "inline",
            contentType: "image/png",
            downloadUrl: "https://private.example/file",
            etag: "example-etag",
            pathname,
            url: "https://private.example/file",
          },
        },
        type: "blob.upload-completed",
      }),
      headers: { "content-type": "application/json" },
      method: "POST",
    }),
    {
      authUrl: "https://privana.test",
      getActor: () => {
        authenticated = true;
        return Promise.resolve("creator-a");
      },
      token: "configured",
    }
  );
  expect(authenticated).toBe(false);
  expect(response.status).toBe(403);
});
