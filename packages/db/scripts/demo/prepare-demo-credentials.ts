import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { z } from "zod";
import type { DemoAccountDefinition } from "./definitions";

const accountSchema = z
  .object({
    description: z.string(),
    email: z.email(),
    key: z.string(),
    password: z.string().min(24).max(128),
    role: z.string(),
    userId: z.string(),
  })
  .strict();
const manifestSchema = z
  .object({
    accounts: z
      .array(accountSchema)
      .refine(
        (accounts) =>
          new Set(accounts.map((account) => account.userId)).size ===
          accounts.length
      ),
    createdAt: z.iso.datetime(),
    seededAt: z.iso.datetime().nullable(),
    status: z.enum(["pending", "ready"]),
    version: z.literal(1),
  })
  .strict();
export type DemoCredentials = z.infer<typeof manifestSchema>;
export async function prepareDemoCredentials(
  path: string,
  definitions: DemoAccountDefinition[]
): Promise<DemoCredentials> {
  let previous: DemoCredentials | null = null;
  try {
    previous = manifestSchema.parse(JSON.parse(await readFile(path, "utf8")));
  } catch (error) {
    if (
      !(error instanceof Error && "code" in error && error.code === "ENOENT")
    ) {
      // biome-ignore lint/style/useErrorCause: Parser details may include plaintext passwords from the local credential file.
      throw new Error(
        "O arquivo local de credenciais é inválido. Nenhum dado foi alterado."
      );
    }
  }
  const accounts = definitions.map((definition) => {
    const existing = previous?.accounts.find(
      (account) => account.userId === definition.userId
    );
    if (
      existing &&
      (existing.email !== definition.email || existing.key !== definition.key)
    ) {
      throw new Error(
        "O arquivo de credenciais não corresponde às contas de demonstração esperadas."
      );
    }
    return {
      description: definition.description,
      email: definition.email,
      key: definition.key,
      password:
        existing?.password ?? `P!${randomBytes(24).toString("base64url")}9a`,
      role: definition.role,
      userId: definition.userId,
    };
  });
  if (
    previous?.accounts.some(
      (account) =>
        !definitions.some((definition) => definition.userId === account.userId)
    )
  ) {
    throw new Error(
      "O arquivo contém contas não reconhecidas. Nenhuma credencial foi substituída."
    );
  }
  return {
    accounts,
    createdAt: previous?.createdAt ?? new Date().toISOString(),
    seededAt: previous?.seededAt ?? null,
    status: "pending",
    version: 1,
  };
}
