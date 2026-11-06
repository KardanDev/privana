"use client";

import { Button } from "@privana/ui/components/button";
import { cn } from "@privana/ui/lib/utils";
import { Bell, CheckCheck } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { ContentSkeleton } from "@/domains/feed/components/content-skeleton";
import { QueryFeedback } from "@/domains/feed/components/query-feedback";
import { SocialHeading } from "@/domains/feed/social-heading";
import { EmptyState } from "@/shared/components/empty-state";
import { formatDate } from "@/shared/formatting/format-date";
import { useNotifications } from "./use-notifications";
export function NotificationsPage() {
  const {
    notifications,
    markRead,
    markAllRead,
    markNotificationRead,
    retryNotifications,
  } = useNotifications();
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <SocialHeading title="Notificações">
        <Button
          disabled={
            markRead.isPending ||
            !notifications.data?.some((item) => !item.readAt)
          }
          onClick={markAllRead}
          size="sm"
          variant="outline"
        >
          <CheckCheck data-icon="inline-start" />
          Ler todas
        </Button>
      </SocialHeading>
      {notifications.isLoading ? <ContentSkeleton /> : null}
      {notifications.isError ? (
        <QueryFeedback error={notifications.error} retry={retryNotifications} />
      ) : null}
      {notifications.data?.length === 0 ? (
        <EmptyState
          description="Quando suas conexões tiverem novidades, você encontra tudo neste espaço."
          icon={Bell}
          title="Tudo em dia por aqui"
        />
      ) : null}
      <div
        aria-busy={markRead.isPending}
        className="divide-y overflow-hidden rounded-lg border bg-card"
      >
        {notifications.data?.map((notification) => (
          <article
            className={cn(
              "flex items-start gap-3 px-4 py-4 sm:px-5",
              !notification.readAt && "bg-accent/20"
            )}
            key={notification.id}
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Bell aria-hidden="true" className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                className="font-semibold hover:text-primary"
                data-notification-id={notification.id}
                href={
                  notification.href.startsWith("/") &&
                  !notification.href.startsWith("//")
                    ? (notification.href as Route)
                    : "/notifications"
                }
                onClick={markNotificationRead}
              >
                {notification.title}
              </Link>
              <p className="mt-1 break-words text-muted-foreground text-sm leading-relaxed">
                {notification.body}
              </p>
              <time
                className="mt-2 block text-muted-foreground text-xs"
                dateTime={notification.createdAt}
              >
                {formatDate(notification.createdAt)}
              </time>
            </div>
            {notification.readAt ? null : (
              <Button
                aria-label="Marcar notificação como lida"
                data-notification-id={notification.id}
                disabled={markRead.isPending}
                onClick={markNotificationRead}
                size="icon"
                variant="ghost"
              >
                <span className="size-2 rounded-full bg-primary" />
              </Button>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
