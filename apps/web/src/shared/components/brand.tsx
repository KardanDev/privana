"use client";

import Image from "next/image";
import Link from "next/link";
import { usePlatform } from "@/shared/platform/use-platform";

export function Brand({ compact = false }: { compact?: boolean }) {
  const { brand } = usePlatform();
  return (
    <Link
      aria-label={`${brand.name}, página inicial`}
      className="inline-flex min-w-0 items-center gap-2.5"
      href="/"
    >
      {brand.logoUrl ? (
        <Image
          alt=""
          className="size-9 shrink-0 rounded-lg object-contain"
          height={36}
          src={brand.logoUrl}
          unoptimized
          width={36}
        />
      ) : (
        <svg
          aria-hidden="true"
          className="size-9 text-primary"
          fill="none"
          viewBox="0 0 36 36"
        >
          <circle cx="18" cy="18" fill="currentColor" r="16" />
          <path
            d="M12 25V11h6.1c4 0 6.4 2.2 6.4 5.6 0 3.5-2.6 5.7-6.7 5.7h-2.2V25H12Zm3.6-6h2.2c2.1 0 3.1-.8 3.1-2.4 0-1.5-1-2.3-3.1-2.3h-2.2V19Z"
            fill="white"
          />
          <circle cx="26.6" cy="9.4" fill="var(--accent)" r="4" />
        </svg>
      )}
      {!compact && (
        <span
          className="truncate font-bold font-heading text-[24px] tracking-[-1px] lg:hidden xl:inline"
          translate="no"
        >
          {brand.name}
          <span className="text-primary">.</span>
        </span>
      )}
    </Link>
  );
}
