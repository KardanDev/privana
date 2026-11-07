const commentPattern = /<!--[\s\S]*?-->/g;
const headingPattern = /^## ([^\r\n]+)\r?$/gm;

export function readSections(body) {
  const content = (body ?? "").replace(commentPattern, "");
  const headings = [...content.matchAll(headingPattern)];
  const sections = new Map();
  for (const [index, heading] of headings.entries()) {
    const value = content
      .slice(heading.index + heading[0].length, headings[index + 1]?.index)
      .trim();
    if (sections.has(heading[1])) {
      throw new Error(`Remove duplicate section: ${heading[1]}.`);
    }
    sections.set(heading[1], value);
  }
  return sections;
}
