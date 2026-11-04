export function hasReadableAccent(hex: string): boolean {
  const components = [1, 3, 5].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255
  );
  const [red = 1, green = 1, blue = 1] = components.map((component) =>
    component <= 0.040_45
      ? component / 12.92
      : ((component + 0.055) / 1.055) ** 2.4
  );
  const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
  return 1.05 / (luminance + 0.05) >= 4.5;
}
