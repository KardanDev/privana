import { expect, test } from "bun:test";
import type { ViewerDTO } from "@privana/api/contracts/product";
import { getStudioEntry } from "../../src/shared/layout/get-studio-entry";
import { isNavigationActive } from "../../src/shared/layout/is-navigation-active";

const fan: ViewerDTO = {
  creatorId: null,
  creatorStatus: null,
  email: "fixture@example.invalid",
  id: "fictional-viewer",
  image: null,
  name: "Conta fictícia",
  role: "user",
};

test("anonymous and unresolved viewers never receive an application or workspace entry", () => {
  for (const viewer of [null, undefined]) {
    for (const enabled of [true, false]) {
      expect(getStudioEntry(viewer, enabled, "Meu Studio")).toBeNull();
    }
  }
});

test("an account role or stale status cannot substitute for a creator profile", () => {
  for (const role of [
    "user",
    "creator",
    "admin",
    "moderator",
    "editor",
    "analyst",
  ]) {
    const viewer = { ...fan, creatorStatus: "ACTIVE", role };
    expect(getStudioEntry(viewer, false, "Meu Studio")).toBeNull();
    expect(getStudioEntry(viewer, true, "Meu Studio")).toEqual({
      kind: "application",
      label: "Quero publicar",
    });
  }
});

test("closing applications preserves existing profile recovery and CMS workspace labels", () => {
  for (const creatorStatus of [
    "ACTIVE",
    "SUSPENDED",
    "REJECTED",
    "UNKNOWN",
    null,
  ]) {
    for (const enabled of [true, false]) {
      expect(
        getStudioEntry(
          { ...fan, creatorId: "fictional-profile", creatorStatus },
          enabled,
          "Meu espaço de criação"
        )
      ).toEqual({ kind: "workspace", label: "Meu espaço de criação" });
    }
  }
  expect(
    getStudioEntry(
      { ...fan, creatorId: "fictional-profile", creatorStatus: "PENDING" },
      false,
      "Meu Studio"
    )
  ).toEqual({ kind: "workspace", label: "Minha candidatura" });
});

test("active navigation respects feed aliases and path boundaries without assuming a missing route", () => {
  expect(isNavigationActive(null, "/explore")).toBe(false);
  expect(isNavigationActive("/feed", "/")).toBe(true);
  expect(isNavigationActive("/messages/thread", "/messages")).toBe(true);
  expect(isNavigationActive("/messages-other", "/messages")).toBe(false);
  expect(isNavigationActive("/explore", "/")).toBe(false);
});
