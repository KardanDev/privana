import { generatedPaths } from "./policy.mjs";

export function measureChange(files) {
  let lines = 0;
  for (const file of files) {
    if (!generatedPaths.some((pattern) => pattern.test(file.filename))) {
      lines += file.additions + file.deletions;
    }
  }
  return { files: files.length, lines };
}
