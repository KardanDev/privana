import { spawnSync } from "node:child_process";
import type { SyncEntry, SyncOptions } from "./sync-types";

interface ExecutionOptions {
  encoding: "utf8";
  input: string;
  maxBuffer: number;
  shell: false;
  stdio: ["pipe", "pipe", "pipe"];
  timeout: number;
}
type Execute = (
  command: string,
  args: string[],
  options: ExecutionOptions
) => { error?: Error; status: number | null };
export function executeVercelSync(
  entry: SyncEntry,
  options: SyncOptions,
  execute: Execute = spawnSync
): void {
  if (options.dryRun) {
    return;
  }
  const args = [
    "x",
    "vercel",
    "env",
    "add",
    entry.key,
    options.target,
    "--force",
    "--yes",
    "--sensitive",
  ];
  if (options.scope) {
    args.push("--scope", options.scope);
  }
  const result = execute("bun", args, {
    encoding: "utf8",
    input: `${entry.value}\n`,
    maxBuffer: 1_048_576,
    shell: false,
    stdio: ["pipe", "pipe", "pipe"],
    timeout: 60_000,
  });
  if (result.error || result.status !== 0) {
    throw new Error(
      `Vercel sync failed for ${entry.key}; review the target and CLI authentication, then retry.`
    );
  }
}
