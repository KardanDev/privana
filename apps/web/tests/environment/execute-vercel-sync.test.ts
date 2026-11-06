import { expect, test } from "bun:test";
import { executeVercelSync } from "../../../../scripts/environment/execute-vercel-sync";

test("Vercel receives a fixed command and exact stdin; shell interpolation and output inheritance are disabled", () => {
  const value = "opaque$token`with spaces`";
  let executed = false;
  executeVercelSync(
    { key: "UPSTASH_BLOB_TOKEN", value },
    { dryRun: false, files: [], scope: "privana-team", target: "production" },
    (command, args, options) => {
      executed = true;
      expect(command).toBe("bun");
      expect(args).toEqual([
        "x",
        "vercel",
        "env",
        "add",
        "UPSTASH_BLOB_TOKEN",
        "production",
        "--force",
        "--yes",
        "--sensitive",
        "--scope",
        "privana-team",
      ]);
      expect(args.join(" ")).not.toContain(value);
      expect(options.input).toBe(`${value}\n`);
      expect(options.shell).toBe(false);
      expect(options.stdio).toEqual(["pipe", "pipe", "pipe"]);
      return { status: 0 };
    }
  );
  expect(executed).toBe(true);
});

test("provider process failures cannot echo secrets through errors or captured output", () => {
  expect(() =>
    executeVercelSync(
      { key: "DATABASE_URL", value: "never-print-connection" },
      { dryRun: false, files: [], target: "preview" },
      () => ({
        error: new Error("never-print-connection"),
        status: 1,
        stderr: "never-print-provider-body",
      })
    )
  ).toThrow("Vercel sync failed for DATABASE_URL");
});
