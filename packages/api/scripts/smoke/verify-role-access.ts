import assert from "node:assert/strict";
import type { AppRouterClient } from "../../src/routers/index";
import { expectDenied } from "./expect-denied";

export async function verifyRoleAccess(client: AppRouterClient, role: string) {
  if (["admin", "editor"].includes(role)) {
    await client.admin.cms.get();
  } else {
    await expectDenied(client.admin.cms.get());
  }
  if (["admin", "analyst"].includes(role)) {
    const analytics = await client.admin.analytics.overview({ days: 7 });
    assert.equal(analytics.daily.length, 7);
    await client.admin.operations.transactions({ page: 0 });
    await client.admin.operations.subscriptions({ page: 0 });
  } else {
    await expectDenied(client.admin.analytics.overview());
  }
  if (["admin", "moderator"].includes(role)) {
    await client.admin.operations.reports({ page: 0 });
  } else {
    await expectDenied(client.admin.operations.reports({ page: 0 }));
  }
  await client.settings.get();
  await client.notifications.list();
  await client.memberships.list();
}
