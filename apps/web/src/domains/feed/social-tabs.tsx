import { cn } from "@privana/ui/lib/utils";
import Link from "next/link";

export function SocialTabs({ active }: { active: "latest" | "following" }) {
  return (
    <nav aria-label="Publicações" className="grid grid-cols-2 border-b">
      {(
        [
          { href: "/", id: "latest", label: "Recentes" },
          { href: "/feed", id: "following", label: "Seguindo" },
        ] as const
      ).map((tab) => (
        <Link
          aria-current={active === tab.id ? "page" : undefined}
          className={cn(
            "relative px-4 py-3 text-center font-medium text-sm outline-none transition-colors hover:bg-muted focus-visible:bg-accent",
            active === tab.id
              ? "text-primary after:absolute after:inset-x-8 after:bottom-0 after:h-0.5 after:bg-primary"
              : "text-muted-foreground"
          )}
          href={tab.href}
          key={tab.id}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
