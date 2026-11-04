const HTML_CHARACTERS: Record<string, string> = {
  "'": "&#39;",
  '"': "&quot;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
};
const HTML_PATTERN = /[&<>"']/g;

export function escapeHtml(value: string): string {
  return value.replace(
    HTML_PATTERN,
    (character) => HTML_CHARACTERS[character] ?? character
  );
}
