import type { NotificationDTO } from "@privana/api/contracts/product";

export function rollbackNotificationRead(
  current: NotificationDTO[] | undefined,
  previous: NotificationDTO[] | undefined,
  readAt: string
): NotificationDTO[] | undefined {
  const original = new Map(
    previous?.map((notification) => [notification.id, notification])
  );
  // Roll back only this mutation's timestamp; preserve newer reads and arrivals.
  return current?.map((notification) =>
    notification.readAt === readAt && original.has(notification.id)
      ? {
          ...notification,
          readAt: original.get(notification.id)?.readAt ?? null,
        }
      : notification
  );
}
