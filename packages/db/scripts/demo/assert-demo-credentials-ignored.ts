import { execFileSync } from "node:child_process";
export function assertDemoCredentialsIgnored(workspace: string): void {
  const relative = "apps/web/.local-demo-credentials.json";
  try {
    for (const candidate of [
      relative,
      `${relative}.lock`,
      `${relative}.probe.tmp`,
    ]) {
      execFileSync("git", ["check-ignore", "--quiet", "--", candidate], {
        cwd: workspace,
        stdio: "ignore",
      });
    }
  } catch (error) {
    throw new Error(
      "Ignore apps/web/.local-demo-credentials.json* no Git antes de gerar credenciais locais.",
      { cause: error }
    );
  }
}
