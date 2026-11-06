import { parseEnv } from "node:util";
import { createSyncPlan } from "./create-sync-plan";
import { parseSyncArgs } from "./parse-sync-args";
import type { SyncEntry, SyncOptions } from "./sync-types";

interface SyncDependencies {
  execute: (entry: SyncEntry, options: SyncOptions) => void;
  readFile: (file: string) => string;
  write: (line: string) => void;
}
export function runEnvironmentSync(
  args: string[],
  dependencies: SyncDependencies
): void {
  const options = parseSyncArgs(args);
  const sources = options.files.map((file) => {
    try {
      return parseEnv(dependencies.readFile(file));
    } catch (cause) {
      throw new Error(
        "Unable to read environment file; verify each explicit source path and its dotenv syntax.",
        { cause }
      );
    }
  });
  const plan = createSyncPlan(sources, options.target);
  dependencies.write(
    `${options.dryRun ? "Dry run" : "Applying configuration"}: ${options.target}; ${plan.entries.length} values; ${plan.skippedCount} internal/undeclared values skipped.`
  );
  for (const entry of plan.entries) {
    dependencies.write(
      `${options.dryRun ? "Would sync" : "Syncing"} ${entry.key}`
    );
    if (!options.dryRun) {
      dependencies.execute(entry, options);
    }
  }
  dependencies.write(
    options.dryRun
      ? "Dry run complete. No remote changes were made."
      : "Sync complete. Rebuild the target to apply configuration changes."
  );
}
