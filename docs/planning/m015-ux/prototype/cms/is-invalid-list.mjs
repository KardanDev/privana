const handlePattern = /^[a-z0-9_-]{3,40}$/;

export function isInvalidCmsList(format, value) {
  if (!["categories", "handles"].includes(format)) {
    return false;
  }
  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return (
    lines.length > 24 ||
    new Set(lines.map((line) => line.toLocaleLowerCase("pt-BR"))).size !==
      lines.length ||
    lines.some((line) =>
      format === "handles" ? !handlePattern.test(line) : line.length > 60
    )
  );
}
