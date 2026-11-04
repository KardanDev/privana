export function isSafePlatformUrl(value: string): boolean {
  if (value === "") {
    return true;
  }
  try {
    const decoded = decodeURIComponent(value);
    if (
      [...decoded].some(
        (character) =>
          character.charCodeAt(0) <= 32 ||
          character.charCodeAt(0) === 127 ||
          character === "\\"
      )
    ) {
      return false;
    }
    if (value.startsWith("/")) {
      return decoded.startsWith("/") && !decoded.startsWith("//");
    }
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}
