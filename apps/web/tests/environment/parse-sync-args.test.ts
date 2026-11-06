import { expect, test } from "bun:test";
import { parseSyncArgs } from "../../../../scripts/environment/parse-sync-args";

test("sync requires an explicit supported target instead of silently choosing preview", () => {
  for (const args of [[], ["prod"], ["--dry-run"], ["../../production"]]) {
    expect(() => parseSyncArgs(args)).toThrow("target");
  }
});

test("sync accepts an explicit file list, dry-run and one safe scope", () => {
  expect(
    parseSyncArgs([
      "preview",
      "config/.env.base",
      "config/.env.preview",
      "--dry-run",
      "--",
      "--scope",
      "privana-team",
    ])
  ).toEqual({
    dryRun: true,
    files: ["config/.env.base", "config/.env.preview"],
    scope: "privana-team",
    target: "preview",
  });
  expect(parseSyncArgs(["development"]).files).toEqual(["apps/web/.env"]);
});

test("unknown flags, missing scope values and shell-like scope strings fail closed", () => {
  for (const args of [
    ["preview", "--token", "never-log-this-value"],
    ["preview", "--scope"],
    ["preview", "--scope", "--dry-run"],
    ["preview", "--scope", "team;echo unsafe"],
    ["preview", "--scope", "team", "--scope", "other"],
    ["preview", "--", "unexpected-file"],
    ["preview", "--", "--debug"],
  ]) {
    expect(() => parseSyncArgs(args)).toThrow();
  }
  expect(() =>
    parseSyncArgs(["preview", "--token", "never-log-this-value"])
  ).toThrow("Unsupported sync option");
});
