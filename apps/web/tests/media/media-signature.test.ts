import { expect, test } from "bun:test";
import { readStreamPrefix } from "../../src/domains/media/read-stream-prefix";
import { validateMediaSignature } from "../../src/domains/media/validate-media-signature";

test("stored headers distinguish all accepted media from executable or mislabeled content", () => {
  expect(() =>
    validateMediaSignature(
      new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
      "image/png"
    )
  ).not.toThrow();
  expect(() =>
    validateMediaSignature(new Uint8Array([255, 216, 255, 224]), "image/jpeg")
  ).not.toThrow();
  expect(() =>
    validateMediaSignature(
      new TextEncoder().encode("RIFF0000WEBP"),
      "image/webp"
    )
  ).not.toThrow();
  expect(() =>
    validateMediaSignature(
      new Uint8Array([0, 0, 0, 24, 102, 116, 121, 112, 105, 115, 111, 109]),
      "video/mp4"
    )
  ).not.toThrow();
  for (const mime of [
    "image/png",
    "image/jpeg",
    "image/webp",
    "video/mp4",
  ] as const) {
    expect(() =>
      validateMediaSignature(
        new TextEncoder().encode("<html><script>alert(1)</script>"),
        mime
      )
    ).toThrow();
    expect(() => validateMediaSignature(new Uint8Array(), mime)).toThrow();
  }
  expect(() =>
    validateMediaSignature(new Uint8Array([255, 216, 255]), "image/png")
  ).toThrow();
});

test("stored-byte inspection handles split chunks and cancels an oversized body after the small prefix", async () => {
  let reads = 0;
  let cancelled = false;
  const stream = new ReadableStream<Uint8Array>({
    cancel() {
      cancelled = true;
    },
    pull(controller) {
      reads += 1;
      controller.enqueue(new Uint8Array(20).fill(reads));
    },
  });
  const prefix = await readStreamPrefix(stream, 32);
  expect(prefix).toHaveLength(32);
  expect(prefix[0]).toBe(1);
  expect(prefix[31]).toBe(2);
  expect(reads).toBeLessThanOrEqual(3);
  expect(cancelled).toBe(true);
});
