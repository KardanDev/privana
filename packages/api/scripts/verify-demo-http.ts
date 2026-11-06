import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { z } from "zod";
import { requireDemoSmokeEnvironment } from "./smoke/require-demo-smoke-environment";
import { signInDemo } from "./smoke/sign-in-demo";
import { verifyCmsFlow } from "./smoke/verify-cms-flow";
import { verifyCreatorFlow } from "./smoke/verify-creator-flow";
import { verifyMemberFlow } from "./smoke/verify-member-flow";
import { verifyRoleAccess } from "./smoke/verify-role-access";

requireDemoSmokeEnvironment(process.env);
process.stdout.write(
  `Demo HTTP smoke: ${process.env.NODE_ENV}; local target http://localhost:3001. Review the server's development resources before continuing.\n`
);
const manifest = z
  .object({
    accounts: z.array(
      z.object({
        email: z.email(),
        key: z.string(),
        password: z.string(),
        role: z.string(),
      })
    ),
    status: z.literal("ready"),
  })
  .parse(
    JSON.parse(
      await readFile(
        new URL(
          "../../../apps/web/.local-demo-credentials.json",
          import.meta.url
        ),
        "utf8"
      )
    )
  );
const sessions = new Map<string, Awaited<ReturnType<typeof signInDemo>>>();
for (const account of manifest.accounts) {
  // biome-ignore lint/performance/noAwaitInLoops: Serialize real logins to respect authentication throttling and cloud capacity.
  const session = await signInDemo(account);
  await verifyRoleAccess(session.client, account.role);
  sessions.set(account.key, session);
  process.stdout.write(`PASS login and permissions: ${account.email}\n`);
}
const member = sessions.get("member");
const creator = sessions.get("creator");
const editor = sessions.get("editor");
const pending = sessions.get("creator-nova-criadora-demo");
assert.ok(member && creator && editor && pending);
await verifyMemberFlow(member.client, creator.client);
process.stdout.write(
  "PASS feed, premium access, likes, bookmarks, messages and member publication denial\n"
);
await verifyCmsFlow(editor.client);
process.stdout.write(
  "PASS CMS save, stale-version rejection, publish and revision history\n"
);
await verifyCreatorFlow(creator.client, member.client, pending.client);
process.stdout.write(
  "PASS creator drafts, publication, chronological feed, comments, archiving and pending-creator denial\n"
);
