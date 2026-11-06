import { readFileSync } from "node:fs";
import { executeVercelSync } from "./environment/execute-vercel-sync";
import { runEnvironmentSync } from "./environment/run-environment-sync";

try {
  runEnvironmentSync(process.argv.slice(2), {
    execute: executeVercelSync,
    readFile: (file) => readFileSync(file, "utf8"),
    write: (line) => process.stdout.write(`${line}\n`),
  });
} catch (error) {
  // Causes/provider output may contain secrets; expose only the sanitized message.
  process.stderr.write(
    `${error instanceof Error ? error.message : "Environment sync failed."}\n`
  );
  process.exitCode = 1;
}
