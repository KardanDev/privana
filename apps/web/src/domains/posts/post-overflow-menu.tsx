"use client";

import { Button } from "@privana/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@privana/ui/components/dropdown-menu";
import { Flag, MoreHorizontal } from "lucide-react";

export function PostOverflowMenu({ onReport }: { onReport: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label="Opções da publicação"
            size="icon"
            variant="ghost"
          />
        }
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-lg">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onReport}>
            <Flag aria-hidden="true" />
            Denunciar publicação
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
