import { expect, test } from "bun:test";
import { call } from "@orpc/server";
import type { Database } from "@privana/db";
import type { Context } from "../src/context";
import { defaultPlatformConfig } from "../src/contracts/platform";
import { sendMessage } from "../src/domains/messages/send";
import { startConversation } from "../src/domains/messages/start";
import { readPublishedConfig } from "../src/domains/platform/read-published-config";
import { saveProfile } from "../src/domains/studio/save-profile";

const profile = {
  bio: "",
  category: "Arte",
  displayName: "Alice",
  handle: "alice",
  location: "",
  monthlyPriceCents: 0,
};
const disabled = {
  ...defaultPlatformConfig,
  features: {
    creatorApplications: false,
    messaging: false,
    registration: false,
  },
};
const context: Context = {
  db: {
    creatorProfile: { findUnique: () => null },
    platformSettings: {
      findUnique: () => ({ draft: defaultPlatformConfig, published: disabled }),
    },
    user: {
      findUnique: () => ({ id: "alice", role: "member", status: "ACTIVE" }),
    },
  } as unknown as Database,
  session: { user: { id: "alice" } } as unknown as Context["session"],
};
test("published messaging flag rejects both new conversations and sends before writing", async () => {
  await expect(
    call(startConversation, { userId: "bob" }, { context })
  ).rejects.toMatchObject({ code: "FORBIDDEN" });
  await expect(
    call(
      sendMessage,
      { body: "Hello", conversationId: "existing" },
      { context }
    )
  ).rejects.toMatchObject({ code: "FORBIDDEN" });
});
test("disabled creator applications reject new profiles", async () => {
  await expect(call(saveProfile, profile, { context })).rejects.toMatchObject({
    code: "FORBIDDEN",
  });
});
test("disabled applications still allow existing approved profile edits", async () => {
  const creator = {
    ...profile,
    _count: { followers: 0, posts: 0 },
    avatarUrl: null,
    coverUrl: null,
    id: "creator",
    isDemo: false,
    status: "ACTIVE",
    userId: "alice",
  };
  const db = {
    creatorProfile: { findUnique: () => creator, upsert: () => creator },
    follow: { findUnique: () => null },
    user: {
      findUnique: () => ({ id: "alice", role: "member", status: "ACTIVE" }),
    },
  } as unknown as Database;
  const result = await call(saveProfile, profile, {
    context: { ...context, db },
  });
  expect(result.id).toBe("creator");
});
test("platform defaults apply to missing rows but never hide database outages", async () => {
  const db = {
    platformSettings: { findUnique: () => null },
  } as unknown as Database;
  expect(await readPublishedConfig(db)).toEqual(defaultPlatformConfig);
  const offline = {
    platformSettings: {
      findUnique: () => {
        throw new Error("DATABASE_OFFLINE");
      },
    },
  } as unknown as Database;
  await expect(readPublishedConfig(offline)).rejects.toThrow(
    "DATABASE_OFFLINE"
  );
});
