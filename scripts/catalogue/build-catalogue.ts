import { execFile } from "node:child_process";
import { mkdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import tailwind from "@tailwindcss/postcss";
import postcss from "postcss";
import type { CatalogueAsset } from "./catalogue-assets";
import { readCatalogueFonts } from "./read-catalogue-fonts";

export async function buildCatalogue() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
  const { assets, css: fonts } = await readCatalogueFonts(root);
  const output = join(root, "output/playwright/catalogue");
  await mkdir(output, { recursive: true });
  await promisify(execFile)(
    process.execPath,
    [
      "build",
      "apps/web/tests/catalogue/mount-catalogue.tsx",
      "--target=browser",
      "--minify",
      "--env=disable",
      "--define",
      'process.env.NODE_ENV="production"',
      "--outfile",
      join(output, "catalogue.js"),
    ],
    { cwd: root }
  );
  const from = join(root, "packages/ui/src/styles/globals.css");
  const shared = (await readFile(from, "utf8")).replace(
    '@import "tailwindcss";',
    '@import "tailwindcss" source(none);'
  );
  const css = await postcss([tailwind({ optimize: true })]).process(
    `${shared}
@source "../../../../apps/web/src";
@source "../../../../apps/web/tests/fixtures";
@source "../../../../apps/web/tests/catalogue";
:root { --font-hanken: "Hanken Grotesk", "Hanken Grotesk Fallback"; --font-bricolage: "Bricolage Grotesque", "Bricolage Grotesque Fallback"; }
${fonts}`,
    { from }
  );
  const encoder = new TextEncoder();
  const files: [string, CatalogueAsset][] = [
    [
      "/catalogue.js",
      {
        body: await readFile(join(output, "catalogue.js")),
        type: "text/javascript; charset=utf-8",
      },
    ],
    [
      "/catalogue.css",
      { body: encoder.encode(css.css), type: "text/css; charset=utf-8" },
    ],
    [
      "/font-licenses.txt",
      {
        body: await readFile(
          join(root, "docs/planning/m015-brand/font-licenses.txt")
        ),
        type: "text/plain; charset=utf-8",
      },
    ],
    [
      "/",
      {
        body: encoder.encode(
          '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Privana · Componentes</title><link rel="stylesheet" href="/catalogue.css"></head><body><div id="catalogue"></div><script src="/catalogue.js" defer></script></body></html>'
        ),
        type: "text/html; charset=utf-8",
      },
    ],
  ];
  for (const [path, asset] of files) {
    assets.set(path, asset);
  }
  return assets;
}
