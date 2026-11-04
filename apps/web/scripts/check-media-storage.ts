import { createPrismaClient } from "@privana/db";
import { checkStoredMedia } from "./media/check-stored-media";

if (process.env.ALLOW_MEDIA_CHECK !== "1") {
  throw new Error(
    "Use ALLOW_MEDIA_CHECK=1 para executar a verificação de leitura."
  );
}
const postId = process.argv[2];
const { DATABASE_URL, UPSTASH_BLOB_TOKEN } = process.env;
if (!(postId && DATABASE_URL && UPSTASH_BLOB_TOKEN)) {
  throw new Error(
    "Informe o ID da publicação e configure Prisma e Upstash Blob."
  );
}
const db = createPrismaClient({ DATABASE_URL });
try {
  const result = await checkStoredMedia(db, postId, UPSTASH_BLOB_TOKEN);
  process.stdout.write(`${JSON.stringify(result)}\n`);
} catch {
  // Provider failures may carry signed URLs; report only a safe failure marker.
  process.stderr.write(
    "A verificação da mídia armazenada falhou. Nenhum dado foi alterado.\n"
  );
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
