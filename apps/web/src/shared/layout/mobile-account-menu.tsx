"use client";

import type { ViewerDTO } from "@privana/api/contracts/product";
import { Button } from "@privana/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@privana/ui/components/dropdown-menu";
import { Bookmark, Heart, LogOut, Settings, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/shared/components/avatar";
import { usePlatform } from "@/shared/platform/use-platform";
import { useSignOut } from "./use-sign-out";

export function MobileAccountMenu({ viewer }: { viewer: ViewerDTO }) {
  const config = usePlatform();
  const signOut = useSignOut();
  const isStaff = ["admin", "editor", "moderator", "analyst"].includes(
    viewer.role
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label="Abrir menu da conta"
            size="icon"
            variant="ghost"
          />
        }
      >
        <Avatar name={viewer.name} size={36} src={viewer.image} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-xl p-1.5">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate">
            {viewer.name}
          </DropdownMenuLabel>
          <DropdownMenuItem
            className="min-h-11"
            render={<Link href="/settings" />}
          >
            <Settings aria-hidden="true" /> Configurações
          </DropdownMenuItem>
          <DropdownMenuItem
            className="min-h-11"
            render={<Link href="/saved" />}
          >
            <Bookmark aria-hidden="true" /> {config.navigation.saved}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="min-h-11"
            render={<Link href="/memberships" />}
          >
            <Heart aria-hidden="true" /> {config.navigation.memberships}
          </DropdownMenuItem>
          {isStaff ? (
            <DropdownMenuItem
              className="min-h-11"
              render={<Link href="/admin" />}
            >
              <ShieldCheck aria-hidden="true" /> Administração
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="min-h-11"
            disabled={signOut.pending}
            onClick={signOut.signOut}
          >
            <LogOut aria-hidden="true" />{" "}
            {signOut.pending ? "Saindo…" : "Sair da conta"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
