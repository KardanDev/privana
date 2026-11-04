"use client";

import { usePlatform } from "./use-platform";

export function PlatformFooter() {
  const config = usePlatform();
  return (
    <footer className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t px-5 py-5 text-[11px] text-muted-foreground">
      <span>
        © {new Date().getFullYear()} {config.brand.name}
      </span>
      {config.footer.links.map((link) => (
        <a
          className="hover:text-foreground hover:underline"
          href={link.href}
          key={link.href}
        >
          {link.label}
        </a>
      ))}
      {config.pages.map((page) => (
        <a
          className="hover:text-foreground hover:underline"
          href={`/pages/${page.slug}`}
          key={page.slug}
        >
          {page.title}
        </a>
      ))}
      {config.footer.supportEmail ? (
        <a href={`mailto:${config.footer.supportEmail}`}>Suporte</a>
      ) : null}
      {config.footer.text ? (
        <p className="w-full leading-relaxed">{config.footer.text}</p>
      ) : null}
    </footer>
  );
}
