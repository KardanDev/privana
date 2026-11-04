import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PostMedia } from "../../src/domains/posts/post-media";

test("authorized MP4 uses the private delivery endpoint and native accessible controls", () => {
  const html = renderToStaticMarkup(
    <PostMedia
      locked={false}
      mediaType="video/mp4"
      mediaUrl="/api/media/post-1"
      previewUrl={null}
      title="Meu processo criativo"
    />
  );
  expect(html).toContain("<video");
  expect(html).toContain('src="/api/media/post-1"');
  expect(html).toContain('preload="metadata"');
  expect(html).toContain("controls=");
  expect(html).toContain('aria-label="Meu processo criativo"');
  expect(html).toContain("Abrir vídeo");
  expect(html).not.toContain("autoPlay");
  expect(html).not.toContain("autoplay");
});

test("locked posts never serialize a video element or its private source", () => {
  const html = renderToStaticMarkup(
    <PostMedia
      locked
      mediaType="video/mp4"
      mediaUrl="/api/media/private-post"
      previewUrl={null}
      title="Exclusivo"
    />
  );
  expect(html).not.toContain("<video");
  expect(html).not.toContain("/api/media/private-post");
});
