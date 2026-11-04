import type { Prisma } from "../../prisma/generated/client";
import type { DemoAccountDefinition } from "./definitions";
import { isOwnedDemoUser } from "./is-owned-demo-user";
export async function seedDemoUser(
  tx: Prisma.TransactionClient,
  definition: DemoAccountDefinition,
  passwordHash: string
): Promise<void> {
  const existing = await tx.user.findUnique({
    include: { creatorProfile: { select: { isDemo: true } } },
    where: { id: definition.userId },
  });
  const emailOwner = await tx.user.findUnique({
    where: { email: definition.email },
  });
  if (emailOwner && emailOwner.id !== definition.userId) {
    throw new Error(
      "O e-mail reservado já pertence a outra conta. Operação cancelada."
    );
  }
  const accountId = `demo-credential-${definition.userId}`;
  const [account, credential] = await Promise.all([
    tx.account.findUnique({ where: { id: accountId } }),
    tx.account.findFirst({
      where: { providerId: "credential", userId: definition.userId },
    }),
  ]);
  if (
    account &&
    (account.userId !== definition.userId ||
      account.providerId !== "credential" ||
      account.accountId !== definition.userId)
  ) {
    throw new Error("Conflito de conta de credenciais. Operação cancelada.");
  }
  if (credential && credential.id !== accountId) {
    throw new Error(
      "Uma credencial não gerenciada já existe para esta conta. Operação cancelada."
    );
  }
  if (
    existing &&
    !isOwnedDemoUser(
      { ...existing, hasManagedCredential: Boolean(account) },
      definition
    )
  ) {
    throw new Error(
      "Um identificador de demonstração pertence a outra conta. Operação cancelada."
    );
  }
  await tx.user.upsert({
    create: {
      email: definition.email,
      emailNotifications: false,
      emailVerified: true,
      id: definition.userId,
      name: `${definition.name} · demonstração`,
      role: definition.role,
      status: "ACTIVE",
    },
    update: {
      emailNotifications: false,
      emailVerified: true,
      role: definition.role,
      status: "ACTIVE",
    },
    where: { id: definition.userId },
  });
  await tx.account.upsert({
    create: {
      accountId: definition.userId,
      id: accountId,
      password: passwordHash,
      providerId: "credential",
      userId: definition.userId,
    },
    update: { password: passwordHash },
    where: { id: accountId },
  });
}
