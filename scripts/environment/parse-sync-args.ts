import { readSyncTarget } from "./read-sync-target";
import type { SyncOptions } from "./sync-types";

const SCOPE = /^[a-z0-9][a-z0-9_-]*$/i;
export function parseSyncArgs(args: string[]): SyncOptions {
  const [targetArgument] = args;
  const target = readSyncTarget(targetArgument);
  const options: SyncOptions = {
    dryRun: false,
    files: [],
    target,
  };
  let forwarded = false;
  for (let index = 1; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--" && !forwarded) {
      forwarded = true;
    } else if (arg === "--dry-run" && !forwarded && !options.dryRun) {
      options.dryRun = true;
    } else if (arg === "--scope" && !options.scope) {
      const scope = args[index + 1];
      if (!(scope && SCOPE.test(scope))) {
        throw new Error("A valid scope value is required.");
      }
      options.scope = scope;
      index += 1;
    } else if (arg && !arg.startsWith("-") && !forwarded) {
      options.files.push(arg);
    } else {
      throw new Error(
        "Unsupported sync option. Use files, --dry-run and --scope only."
      );
    }
  }
  if (!options.files.length) {
    options.files.push("apps/web/.env");
  }
  return options;
}
