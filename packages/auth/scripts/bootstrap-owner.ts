import { createPrismaClient } from "@privana/db";
import { canBootstrapOwner } from "../src/can-bootstrap-owner";

const email = process.argv[2]?.trim().toLowerCase();
const databaseURL = process.env.DATABASE_URL;
if (!(email && databaseURL)) {
  throw new Error(
    "Uso: bun packages/auth/scripts/bootstrap-owner.ts <email-verificado>. Configure DATABASE_URL no ambiente."
  );
}
const db = createPrismaClient({ DATABASE_URL: databaseURL });
try {
  await db.$transaction(async (transaction) => {
    const user = await transaction.user.findUnique({ where: { email } });
    if (!(canBootstrapOwner(user) && user)) {
      throw new Error(
        "A conta precisa existir, estar ativa e ter o e-mail confirmado. Nenhuma permissão foi alterada."
      );
    }
    if (user.role === "admin") {
      return;
    }
    const updated = await transaction.user.updateMany({
      data: { role: "admin" },
      where: {
        emailVerified: true,
        id: user.id,
        role: user.role,
        status: "ACTIVE",
      },
    });
    if (updated.count !== 1) {
      throw new Error("A conta mudou durante a operação. Tente novamente.");
    }
    await transaction.auditEvent.create({
      data: {
        action: "owner.bootstrap",
        actorId: user.id,
        metadata: { method: "manual-cli" },
        targetId: user.id,
      },
    });
  });
} finally {
  await db.$disconnect();
}
