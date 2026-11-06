"use client";
import type { NotificationDTO } from "@privana/api/contracts/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type MouseEvent, useCallback } from "react";
import { handleActionError } from "@/domains/feed/handle-action-error";
import { client } from "@/utils/orpc";
import { markNotificationsRead } from "./mark-notifications-read";
import { rollbackNotificationRead } from "./rollback-notification-read";

const NOTIFICATIONS_KEY = ["notifications"] as const;
const MARK_READ_KEY = ["notifications", "mark-read"] as const;
interface MarkReadContext {
  previous: NotificationDTO[] | undefined;
  readAt: string;
}

export function useNotifications() {
  const queryClient = useQueryClient();
  const notifications = useQuery({
    queryFn: () => client.notifications.list(),
    queryKey: NOTIFICATIONS_KEY,
  });
  const markRead = useMutation<
    Awaited<ReturnType<typeof client.notifications.markRead>>,
    Error,
    { id?: string },
    MarkReadContext
  >({
    mutationFn: (input: { id?: string }) =>
      client.notifications.markRead(input),
    mutationKey: MARK_READ_KEY,
    onError: (error, _input, context) => {
      if (context) {
        queryClient.setQueryData<NotificationDTO[]>(
          NOTIFICATIONS_KEY,
          (current) =>
            rollbackNotificationRead(current, context.previous, context.readAt)
        );
      }
      handleActionError(error);
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const previous =
        queryClient.getQueryData<NotificationDTO[]>(NOTIFICATIONS_KEY);
      const readAt = new Date().toISOString();
      queryClient.setQueryData<NotificationDTO[]>(
        NOTIFICATIONS_KEY,
        (current) => markNotificationsRead(current, id, readAt)
      );
      return { previous, readAt };
    },
    onSettled: async () => {
      if (queryClient.isMutating({ mutationKey: MARK_READ_KEY }) === 1) {
        await queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
      }
    },
  });
  const markAllRead = useCallback(() => {
    if (queryClient.isMutating({ mutationKey: MARK_READ_KEY }) === 0) {
      markRead.mutate({});
    }
  }, [markRead, queryClient]);
  const markNotificationRead = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const { notificationId } = event.currentTarget.dataset;
      if (
        notificationId &&
        queryClient.isMutating({ mutationKey: MARK_READ_KEY }) === 0 &&
        notifications.data?.some(
          (notification) =>
            notification.id === notificationId && !notification.readAt
        )
      ) {
        markRead.mutate({ id: notificationId });
      }
    },
    [markRead, notifications.data, queryClient]
  );
  const retryNotifications = useCallback(
    () => notifications.refetch(),
    [notifications]
  );
  return {
    markAllRead,
    markNotificationRead,
    markRead,
    notifications,
    retryNotifications,
  };
}
