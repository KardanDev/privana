import { expect, test } from "bun:test";
import type { NotificationDTO } from "@privana/api/contracts/product";
import { markNotificationsRead } from "../../src/domains/notifications/mark-notifications-read";
import { rollbackNotificationRead } from "../../src/domains/notifications/rollback-notification-read";

const unread: NotificationDTO = {
  body: "Body",
  createdAt: "2026-11-06T10:00:00Z",
  href: "/notifications",
  id: "one",
  readAt: null,
  title: "One",
};
const read: NotificationDTO = {
  ...unread,
  id: "two",
  readAt: "2026-11-06T10:01:00Z",
};

test("optimistic mark-all keeps existing read times and rolls back only changed values", () => {
  const before = [unread, read];
  const timestamp = "2026-11-06T10:02:00Z";
  const next = markNotificationsRead(before, undefined, timestamp);
  expect(next?.map((entry) => entry.readAt)).toEqual([timestamp, read.readAt]);
  expect(rollbackNotificationRead(next, before, timestamp)).toEqual(before);
  expect(before[0].readAt).toBeNull();
});

test("failed single-read rollback preserves fresh arrivals and newer confirmed reads", () => {
  const timestamp = "2026-11-06T10:02:00Z";
  const newer = "2026-11-06T10:03:00Z";
  const next = markNotificationsRead([unread, read], unread.id, timestamp);
  const withNewerRead = next?.map((entry) =>
    entry.id === unread.id ? { ...entry, readAt: newer } : entry
  );
  const arrival = { ...unread, id: "arrival" };
  const rollback = rollbackNotificationRead(
    [...(withNewerRead ?? []), arrival],
    [unread, read],
    timestamp
  );
  expect(rollback?.[0]?.readAt).toBe(newer);
  expect(rollback?.at(-1)).toEqual(arrival);
});
