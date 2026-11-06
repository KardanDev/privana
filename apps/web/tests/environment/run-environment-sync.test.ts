import { expect, test } from "bun:test";
import { runEnvironmentSync } from "../../../../scripts/environment/run-environment-sync";
import { createValidEnvironment } from "./create-valid-environment";

test("dry-run reads only supplied fixtures, redacts values and never invokes a subprocess", () => {
  const lines: string[] = [];
  const reads: string[] = [];
  let executions = 0;
  runEnvironmentSync(["production", "config/.env.release", "--dry-run"], {
    execute: () => {
      executions += 1;
    },
    readFile: (file) => {
      reads.push(file);
      return Object.entries({
        ...createValidEnvironment(),
        CLAIM_URL: "claim-must-never-appear",
      })
        .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
        .join("\n");
    },
    write: (line) => lines.push(line),
  });
  expect(reads).toEqual(["config/.env.release"]);
  expect(executions).toBe(0);
  const output = lines.join("\n");
  expect(output).toContain("Dry run");
  expect(output).toContain("DATABASE_URL");
  expect(output).not.toContain("offline-password");
  expect(output).not.toContain("re_f959");
  expect(output).not.toContain("claim-must-never-appear");
  expect(output).not.toContain(createValidEnvironment().BETTER_AUTH_SECRET);
});

test("missing paths and invalid plans fail before any Vercel command and never echo file errors", () => {
  let executions = 0;
  let output = "";
  const dependencies = {
    execute: () => {
      executions += 1;
    },
    readFile: () => {
      throw new Error("sensitive path-or-provider-value");
    },
    write: (line: string) => {
      output += line;
    },
  };
  expect(() =>
    runEnvironmentSync(["preview", "missing.env"], dependencies)
  ).toThrow("Unable to read environment file");
  expect(() =>
    runEnvironmentSync(["production", "bad.env"], {
      ...dependencies,
      readFile: () =>
        "DATABASE_URL=postgres://private:never-print@localhost/db",
    })
  ).toThrow();
  expect(executions).toBe(0);
  expect(output).toBe("");
});

test("an apply executes only the fully validated allowlist and preserves stdin values", () => {
  const calls: {
    key: string;
    value: string;
    target: string;
    scope?: string;
  }[] = [];
  runEnvironmentSync(["preview", "fixture.env", "--scope", "privana-team"], {
    execute: (entry, options) => {
      calls.push({ ...entry, scope: options.scope, target: options.target });
    },
    readFile: () =>
      Object.entries(createValidEnvironment())
        .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
        .join("\n"),
    write: () => undefined,
  });
  expect(calls).toHaveLength(5);
  expect(calls.every((call) => call.target === "preview")).toBe(true);
  expect(calls.every((call) => call.scope === "privana-team")).toBe(true);
  expect(calls.find((call) => call.key === "DATABASE_URL")?.value).toBe(
    createValidEnvironment().DATABASE_URL
  );
});
