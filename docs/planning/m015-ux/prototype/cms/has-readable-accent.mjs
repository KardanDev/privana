// Browser adaptation of packages/api/src/contracts/has-readable-accent.ts.
export function hasReadableAccent(hex) {
  const [red, green, blue] = [1, 3, 5]
    .map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .map((component) =>
      component <= 0.040_45
        ? component / 12.92
        : ((component + 0.055) / 1.055) ** 2.4
    );
  return 1.05 / (red * 0.2126 + green * 0.7152 + blue * 0.0722 + 0.05) >= 4.5;
}
