import assert from "node:assert/strict";
import type { AppRouterClient } from "../../src/routers/index";
import { expectDenied } from "./expect-denied";

export async function verifyCmsFlow(client: AppRouterClient) {
  const original = await client.admin.cms.get();
  // Never publish somebody else's pending changes as part of a smoke test.
  assert.deepEqual(
    original.draft,
    original.published,
    "CMS has pending edits; leave them for their author"
  );
  const saved = await client.admin.cms.saveDraft({
    config: original.draft,
    expectedVersion: original.version,
  });
  await expectDenied(
    client.admin.cms.saveDraft({
      config: original.draft,
      expectedVersion: original.version,
    }),
    "CONFLICT"
  );
  const published = await client.admin.cms.publish({
    expectedVersion: saved.version,
  });
  assert.deepEqual(await client.platform.get(), original.published);
  const revisions = await client.admin.cms.history();
  assert.ok(revisions.some((item) => item.version === published.version));
}
