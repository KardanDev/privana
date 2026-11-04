import { expect, test } from "bun:test";
import { call } from "@orpc/server";
import {
  defaultPlatformConfig,
  platformConfigSchema,
} from "../src/contracts/platform";
import { getCms } from "../src/domains/admin/cms/get";
import { publishCms } from "../src/domains/admin/cms/publish";
import { restoreCmsDraft } from "../src/domains/admin/cms/restore-draft";
import { saveCmsDraft } from "../src/domains/admin/cms/save-draft";
import { getPlatform } from "../src/domains/platform/get";
import { createCmsFixture } from "./cms-fixture";

test("draft save does not change public settings; publish and restore are deliberate audited transitions", async () => {
  const fixture = createCmsFixture();
  const initial = await call(getCms, undefined, { context: fixture.context });
  expect(initial.version).toBe(0);
  const config = structuredClone(defaultPlatformConfig);
  config.brand.name = "Minha comunidade";
  const saved = await call(
    saveCmsDraft,
    { config, expectedVersion: 0 },
    { context: fixture.context }
  );
  expect(saved.version).toBe(1);
  expect(
    (await call(getPlatform, undefined, { context: fixture.context })).brand
      .name
  ).toBe("Privana");
  const published = await call(
    publishCms,
    { expectedVersion: 1 },
    { context: fixture.context }
  );
  expect(published.published.brand.name).toBe(config.brand.name);
  expect(fixture.revisions).toHaveLength(1);
  const changed = structuredClone(config);
  changed.brand.name = "Nova marca";
  await call(
    saveCmsDraft,
    { config: changed, expectedVersion: 2 },
    { context: fixture.context }
  );
  await call(publishCms, { expectedVersion: 3 }, { context: fixture.context });
  const restored = await call(
    restoreCmsDraft,
    { expectedVersion: 4, revisionId: "revision-1" },
    { context: fixture.context }
  );
  expect(restored.draft.brand.name).toBe(config.brand.name);
  expect(restored.published.brand.name).toBe(changed.brand.name);
  expect(restored.version).toBe(5);
  expect(fixture.audits).toHaveLength(5);
});

test("a stale editor cannot overwrite a newer draft", async () => {
  const fixture = createCmsFixture();
  await call(
    saveCmsDraft,
    { config: defaultPlatformConfig, expectedVersion: 0 },
    { context: fixture.context }
  );
  await expect(
    call(publishCms, { expectedVersion: 0 }, { context: fixture.context })
  ).rejects.toMatchObject({ code: "CONFLICT" });
  expect(fixture.getDocument()?.version).toBe(1);
  expect(fixture.revisions).toHaveLength(0);
  expect(fixture.audits).toHaveLength(1);
});

test("failed compare-and-swap does not publish a revision or audit", async () => {
  const fixture = createCmsFixture();
  fixture.loseCas();
  await expect(
    call(publishCms, { expectedVersion: 0 }, { context: fixture.context })
  ).rejects.toMatchObject({ code: "CONFLICT" });
  expect(fixture.getDocument()).toBeNull();
  expect(fixture.revisions).toHaveLength(0);
  expect(fixture.audits).toHaveLength(0);
});

for (const role of ["member", "moderator", "analyst"]) {
  test(`${role} cannot edit CMS despite a stale admin session`, async () => {
    const fixture = createCmsFixture(role);
    await expect(
      call(
        saveCmsDraft,
        { config: defaultPlatformConfig, expectedVersion: 0 },
        { context: fixture.context }
      )
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(fixture.getDocument()).toBeNull();
  });
}

test("suspended editors cannot read or mutate CMS", async () => {
  const fixture = createCmsFixture("editor", "SUSPENDED");
  await expect(
    call(getCms, undefined, { context: fixture.context })
  ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
});

for (const url of [
  "javascript:alert(1)",
  "//evil.test",
  "/\\evil.test",
  "/%2fexample.test",
  "https://user:pass@example.test",
  "/%0aevil",
  "https://example.test/%00",
]) {
  test(`CMS rejects unsafe URL ${url}`, () => {
    const config = structuredClone(defaultPlatformConfig);
    config.brand.logoUrl = url;
    expect(platformConfigSchema.safeParse(config).success).toBe(false);
  });
}

test("CMS accepts local or HTTPS destinations, rejects duplicate slugs/categories and low contrast accents", () => {
  const config = structuredClone(defaultPlatformConfig);
  config.brand.logoUrl = "/assets/logo.svg";
  expect(platformConfigSchema.safeParse(config).success).toBe(true);
  config.brand.logoUrl = "https://example.test/logo.svg";
  expect(platformConfigSchema.safeParse(config).success).toBe(true);
  config.brand.accentColor = "#eeeeee";
  expect(platformConfigSchema.safeParse(config).success).toBe(false);
  config.brand.accentColor = "#6D28D9";
  config.discovery.categories = ["Arte", "arte"];
  expect(platformConfigSchema.safeParse(config).success).toBe(false);
  config.discovery.categories = [];
  config.pages = [
    { body: "Texto", slug: "termos", title: "Termos" },
    { body: "Texto", slug: "termos", title: "Outro" },
  ];
  expect(platformConfigSchema.safeParse(config).success).toBe(false);
});
