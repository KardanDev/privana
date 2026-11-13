import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import postcss from "postcss";
import type { CatalogueAsset } from "./catalogue-assets";

const fontUrl = /url\(\.\.\/media\/([a-zA-Z0-9._-]+\.woff2)\)/g;
const families = new Set([
  "Hanken Grotesk",
  "Hanken Grotesk Fallback",
  "Bricolage Grotesque",
  "Bricolage Grotesque Fallback",
]);

export async function readCatalogueFonts(root: string) {
  const assets = new Map<string, CatalogueAsset>();
  const faces: string[] = [];
  const found = new Set<string>();
  const staticRoot = join(root, "apps/web/.next/static");
  const chunks = await readdir(join(staticRoot, "chunks")).catch(() => []);
  const sheets = await Promise.all(
    chunks
      .filter((file) => file.endsWith(".css"))
      .map(async (name) =>
        postcss.parse(await readFile(join(staticRoot, "chunks", name), "utf8"))
      )
  );
  for (const css of sheets) {
    css.walkAtRules("font-face", (rule) => {
      const family = rule.nodes?.find(
        (node) => node.type === "decl" && node.prop === "font-family"
      );
      const name =
        family?.type === "decl"
          ? family.value.replaceAll('"', "").replaceAll("'", "")
          : "";
      if (!families.has(name)) {
        return;
      }
      found.add(name);
      const face = rule.clone();
      face.walkDecls("src", (declaration) => {
        declaration.value = declaration.value.replace(
          fontUrl,
          (_, file: string) => {
            assets.set(`/fonts/${file}`, {
              body: new Uint8Array(),
              type: "font/woff2",
            });
            return `url(/fonts/${file})`;
          }
        );
      });
      faces.push(face.toString());
    });
  }
  if (found.size !== families.size || assets.size === 0) {
    throw new Error(
      "Catalogue fonts are missing. Run `bun run build` once, then `bun run ui:catalogue`."
    );
  }
  await Promise.all(
    Array.from(assets, async ([path, asset]) => {
      asset.body = await readFile(
        join(staticRoot, "media", path.slice("/fonts/".length))
      );
    })
  );
  return { assets, css: faces.join("\n") };
}
