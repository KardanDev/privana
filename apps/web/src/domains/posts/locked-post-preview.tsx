import { buttonVariants } from "@privana/ui/components/button";
import { cn } from "@privana/ui/lib/utils";
import Link from "next/link";
import { LockedPostNotice } from "./locked-post-notice";

export function LockedPostPreview({ handle }: { handle: string }) {
  return (
    <LockedPostNotice>
      <Link
        className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
        href={`/creators/${handle}`}
      >
        Ver perfil do criador
      </Link>
    </LockedPostNotice>
  );
}
