"use client";
import { cn } from "@privana/ui/lib/utils";
import Image from "next/image";
import { useAvatarImage } from "./use-avatar-image";

export function Avatar({
  name,
  src,
  className,
  size = 40,
}: {
  name: string;
  src?: string | null;
  className?: string;
  size?: number;
}) {
  const image = useAvatarImage(src);
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent font-semibold text-primary",
        className
      )}
      style={{ height: size, width: size }}
    >
      {src && image.showImage ? (
        <Image
          alt={name}
          className="object-cover"
          fill
          onError={image.onError}
          sizes={`${size}px`}
          src={src}
          unoptimized
        />
      ) : (
        <span aria-label={name} role="img">
          {name.trim().slice(0, 2).toUpperCase()}
        </span>
      )}
    </span>
  );
}
