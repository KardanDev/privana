import type { NotificationDTO } from "@privana/api/contracts/product";

export function markNotificationsRead(
  notifications: NotificationDTO[] | undefined,
  id: string | undefined,
  readAt: string
): NotificationDTO[] | undefined {
  return notifications?.map((notification) =>
    !notification.readAt && (!id || notification.id === id)
      ? { ...notification, readAt }
      : notification
  );
}
