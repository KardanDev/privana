import { describe, expect, test } from "bun:test";
import { ORPCError } from "@orpc/server";
import { BlobError } from "@upstash/blob";
import { assertMediaOrigin } from "../../src/domains/media/assert-media-origin";
import { mediaErrorResponse } from "../../src/domains/media/media-error-response";
import { readMediaJson } from "../../src/domains/media/read-media-json";
import { validateMediaMetadata } from "../../src/domains/media/validate-media-metadata";
import { validateMediaPath } from "../../src/domains/media/validate-media-path";

const pathname = "creator-a/8bd645bc-6372-4db5-9d46-57fb2fbad974.png";

describe("media ownership", () => {
  test("accepts a UUID filename owned by the authenticated creator", () => {
    expect(validateMediaPath(pathname, "creator-a")).toBe("image/png");
  });
  test("rejects another user's key, URL, traversal, encoded path and nested path", () => {
    for (const key of [
      pathname,
      `https://example.com/${pathname}`,
      `creator-b/../${pathname}`,
      `creator-b/%2e%2e/${pathname}`,
      `creator-b/nested/${pathname}`,
    ]) {
      expect(() => validateMediaPath(key, "creator-b")).toThrow();
    }
  });
  test("rejects executable and unsupported extensions", () => {
    expect(() =>
      validateMediaPath(pathname.replace(".png", ".svg"), "creator-a")
    ).toThrow();
    expect(() =>
      validateMediaPath(pathname.replace(".png", ".html"), "creator-a")
    ).toThrow();
  });
  test("rejects changed metadata and MIME mismatches", () => {
    expect(() =>
      validateMediaMetadata(
        { contentType: "text/html", pathname, size: 20 },
        pathname,
        "image/png"
      )
    ).toThrow();
    expect(() =>
      validateMediaMetadata(
        {
          contentType: "image/png",
          pathname: pathname.replace("creator-a", "creator-b"),
          size: 20,
        },
        pathname,
        "image/png"
      )
    ).toThrow();
  });
  test("rejects empty and oversized files", () => {
    for (const size of [0, -1, 100 * 1024 * 1024 + 1]) {
      expect(() =>
        validateMediaMetadata(
          { contentType: "image/png", pathname, size },
          pathname,
          "image/png"
        )
      ).toThrow();
    }
  });
});

describe("media HTTP boundaries", () => {
  test("requires the exact configured origin", () => {
    expect(() =>
      assertMediaOrigin(
        new Headers({ origin: "https://privana.test" }),
        "https://privana.test"
      )
    ).not.toThrow();
    for (const origin of [
      "https://evil.test",
      "https://privana.test.evil.test",
      "null",
      "",
    ]) {
      expect(() =>
        assertMediaOrigin(new Headers({ origin }), "https://privana.test")
      ).toThrow();
    }
  });
  test("enforces body size even without content-length", async () => {
    const request = new Request("https://privana.test", {
      body: JSON.stringify({ value: "a".repeat(17_000) }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });
    await expect(readMediaJson(request)).rejects.toMatchObject({ status: 413 });
  });
  test("maps denied access, missing blobs and outages without disclosing details", async () => {
    for (const [error, status] of [
      [new ORPCError("UNAUTHORIZED"), 401],
      [new ORPCError("FORBIDDEN"), 403],
      [new ORPCError("NOT_FOUND"), 404],
      [new BlobError("not_found"), 404],
      [new BlobError("request_failed"), 503],
      [new Error("secret-token"), 500],
    ] as const) {
      const response = mediaErrorResponse(error);
      expect(response.status).toBe(status);
      // biome-ignore lint/performance/noAwaitInLoops: Each response is independent and tiny in this status mapping test.
      expect(await response.text()).not.toContain("secret-token");
      expect(response.headers.get("cache-control")).toContain("no-store");
    }
  });
});
