"use client";

import { Button } from "@privana/ui/components/button";
import { cn } from "@privana/ui/lib/utils";
import { useCallback, useState } from "react";

export function PostBody({ title, body }: { title: string; body: string }) {
  const [expanded, setExpanded] = useState(false);
  const toggle = useCallback(() => setExpanded((value) => !value), []);
  return (
    <div className="px-4 pb-4 sm:px-5">
      <h2 className="break-words font-semibold text-[15px] leading-6">
        {title}
      </h2>
      {body ? (
        <p
          className={cn(
            "mt-1.5 whitespace-pre-wrap break-words text-[15px] leading-6",
            !expanded && "line-clamp-6"
          )}
        >
          {body}
        </p>
      ) : null}
      {body.length > 350 ? (
        <Button
          aria-expanded={expanded}
          className="mt-1 h-auto px-0"
          onClick={toggle}
          size="sm"
          variant="link"
        >
          {expanded ? "Mostrar menos" : "Mostrar mais"}
        </Button>
      ) : null}
    </div>
  );
}
