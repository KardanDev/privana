import { expect, test } from "bun:test";
import { QueryClient } from "@tanstack/react-query";
import { profileFields } from "../../src/domains/studio/profile-fields";
import type { StudioCache } from "../../src/domains/studio/studio-cache-types";
import { updateStudioProfileCache } from "../../src/domains/studio/update-studio-profile-cache";
import { creator, studio } from "./studio-fixtures";

test("profile field updates and rollback preserve permissions, following state and concurrent counts", () => {
  const client = new QueryClient();
  client.setQueryData(["studio"], studio);
  client.setQueryData(["creator", "luna"], creator);
  client.setQueryData(["creator", "other"], {
    ...creator,
    displayName: "Other",
    id: "other",
  });
  const original = profileFields(creator);
  updateStudioProfileCache(client, ["studio"], creator.id, {
    ...original,
    displayName: "Updated",
    handle: "updated",
    monthlyPriceCents: 3990,
  });
  expect(client.getQueryData(["creator", "luna"])).toMatchObject({
    displayName: "Updated",
    followerCount: 2,
    handle: "updated",
    status: "ACTIVE",
  });
  client.setQueryData(["creator", "luna"], {
    ...creator,
    displayName: "Updated",
    followerCount: 5,
    isFollowing: true,
  });
  updateStudioProfileCache(client, ["studio"], creator.id, original);
  expect(client.getQueryData(["creator", "luna"])).toMatchObject({
    displayName: "Luna",
    followerCount: 5,
    isFollowing: true,
    status: "ACTIVE",
  });
  expect(
    client.getQueryData<StudioCache>(["studio"])?.pages[0]?.profile?.displayName
  ).toBe("Luna");
  expect(client.getQueryData(["creator", "other"])).toMatchObject({
    displayName: "Other",
  });
});

test("profile writes do not invent an approved profile for a pending application", () => {
  const client = new QueryClient();
  const empty = { ...studio, pages: [{ ...studio.pages[0], profile: null }] };
  client.setQueryData(["studio"], empty);
  updateStudioProfileCache(
    client,
    ["studio"],
    creator.id,
    profileFields(creator)
  );
  expect(
    client.getQueryData<StudioCache>(["studio"])?.pages[0]?.profile
  ).toBeNull();
  expect(client.getQueryData(["creator", "luna"])).toBeUndefined();
});
