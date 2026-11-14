"use client";

import { Button } from "@privana/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@privana/ui/components/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { type MouseEvent, useCallback } from "react";
import {
  type OperationsSection,
  operationsNavigation,
} from "./operations-navigation";

export function OperationsSectionNavigation({
  section,
  viewerRole,
  onSelect,
  compact = false,
}: {
  section: OperationsSection;
  viewerRole: string;
  onSelect: (section: string) => void;
  compact?: boolean;
}) {
  const allowed = operationsNavigation.filter((item) =>
    item.roles.some((role) => role === viewerRole)
  );
  const current = allowed.find((item) => item.id === section);
  const selectButton = useCallback(
    (event: MouseEvent<HTMLButtonElement>) =>
      onSelect(event.currentTarget.value),
    [onSelect]
  );
  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Selecionar seção: ${current?.label ?? "Seções da operação"}`}
          className="w-full min-w-0 justify-between"
          render={<Button variant="outline" />}
        >
          <span className="min-w-0 text-left [overflow-wrap:anywhere]">
            {current?.label ?? "Seções da operação"}
          </span>
          <ChevronDown aria-hidden="true" data-icon="inline-end" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Seções da operação</DropdownMenuLabel>
            <DropdownMenuRadioGroup onValueChange={onSelect} value={section}>
              {allowed.map(({ id, label, icon: Icon }) => (
                <DropdownMenuRadioItem closeOnClick key={id} value={id}>
                  <Icon aria-hidden="true" />
                  <span className="min-w-0">{label}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return (
    <nav
      aria-label="Seções da operação"
      className="flex flex-col gap-1 px-3 pb-4"
    >
      {allowed.map(({ id, label, icon: Icon }) => (
        <Button
          aria-current={section === id ? "page" : undefined}
          className="w-full min-w-0 justify-start whitespace-normal text-left"
          key={id}
          onClick={selectButton}
          value={id}
          variant={section === id ? "secondary" : "ghost"}
        >
          <Icon aria-hidden="true" data-icon="inline-start" />
          <span className="min-w-0 [overflow-wrap:anywhere]">{label}</span>
        </Button>
      ))}
    </nav>
  );
}
