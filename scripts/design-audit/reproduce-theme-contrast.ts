import { readFile } from "node:fs/promises";
import { hasReadableAccent } from "../../packages/api/src/contracts/has-readable-accent";
import { contrastRatio } from "./contrast-ratio";
import { oklchToHex } from "./oklch-to-hex";

const inputPattern = /--input: oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/;
const source = await readFile("packages/ui/src/styles/globals.css", "utf8");
const input = source.match(inputPattern);
if (
  !(
    input &&
    source.includes(
      "--primary: color-mix(in srgb, var(--brand-accent) 60%, white)"
    ) &&
    source.includes("--primary-foreground: #15131b")
  )
) {
  throw new Error(
    "The audited theme derivation changed. Re-measure it instead of reusing these baseline calculations."
  );
}
const inputHex = oklchToHex(
  Number(input[1]),
  Number(input[2]),
  Number(input[3])
);
process.stdout.write(
  `${JSON.stringify(
    {
      acceptedBlackAccent: hasReadableAccent("#000000"),
      darkButtonContrast: contrastRatio("#666666", "#15131b"),
      darkForeground: "#15131b",
      darkMixedBackground: "#666666",
      defaultPurpleWhiteContrast: contrastRatio("#6D28D9", "#ffffff"),
      inputHex,
      inputWhiteContrast: contrastRatio(inputHex, "#ffffff"),
      method:
        "Source-token calculation; not rendered-pixel conformance testing",
    },
    null,
    2
  )}\n`
);
