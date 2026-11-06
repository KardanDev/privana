import { expect, test } from "bun:test";
import type { SettingsDTO } from "@privana/api/contracts/product";
import { rollbackSettingsUpdate } from "../../src/domains/settings/rollback-settings-update";

const before: SettingsDTO = {
  emailNotifications: false,
  image: null,
  locale: "pt-BR",
  name: "Camila",
};
const submitted = {
  emailNotifications: true,
  locale: "pt-BR",
  name: "Camila Rocha",
};

test("settings failure restores submitted fields while retaining newly refreshed avatar data", () => {
  const current = {
    ...before,
    ...submitted,
    image: "https://example.test/new-avatar.png",
  };
  expect(rollbackSettingsUpdate(current, before, submitted)).toEqual({
    ...before,
    image: current.image,
  });
});

test("settings rollback cannot replace a newer saved name or introduce an uncached record", () => {
  expect(
    rollbackSettingsUpdate({ ...before, name: "Newer name" }, before, submitted)
      ?.name
  ).toBe("Newer name");
  expect(rollbackSettingsUpdate(undefined, before, submitted)).toBeUndefined();
});
