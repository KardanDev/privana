"use client";

import { ArrowUpRight } from "lucide-react";
import { PlatformLink } from "./platform-link";
import { usePlatform } from "./use-platform";

export function PlatformAnnouncement() {
  const { announcement } = usePlatform();
  if (!announcement.text) {
    return null;
  }
  return (
    <aside
      aria-label="Comunicado da plataforma"
      className="border-b bg-accent px-5 py-3 text-sm"
    >
      {announcement.href ? (
        <PlatformLink
          className="flex items-center justify-center gap-2 font-medium text-primary"
          href={announcement.href}
        >
          {announcement.text}
          <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
        </PlatformLink>
      ) : (
        <p className="text-center">{announcement.text}</p>
      )}
    </aside>
  );
}
