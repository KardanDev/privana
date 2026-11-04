"use client";

import { Button } from "@privana/ui/components/button";
import { Input } from "@privana/ui/components/input";
import { Textarea } from "@privana/ui/components/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useCmsRows } from "./use-cms-rows";

export interface CmsRowField {
  label: string;
  maxLength: number;
  multiline?: boolean;
  name: string;
  pattern?: string;
  placeholder?: string;
}

export function CmsRows({
  title,
  initial,
  fields,
  maximum,
  onEdit,
}: {
  title: string;
  initial: Record<string, string>[];
  fields: CmsRowField[];
  maximum: number;
  onEdit: () => void;
}) {
  const state = useCmsRows(initial, maximum, onEdit);
  return (
    <fieldset className="flex min-w-0 flex-col gap-4">
      <legend className="mb-3 font-semibold text-sm">{title}</legend>
      {state.rows.length === 0 ? (
        <p className="text-muted-foreground text-xs">
          Nenhum item configurado.
        </p>
      ) : null}
      {state.rows.map((row, index) => (
        <div
          className="flex min-w-0 flex-col gap-3 rounded-lg border bg-background p-4"
          key={row.id}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium text-xs">Item {index + 1}</span>
            <Button
              aria-label={`Remover item ${index + 1} de ${title}`}
              onClick={state.remove}
              size="sm"
              type="button"
              value={row.id}
              variant="ghost"
            >
              <Trash2 data-icon="inline-start" />
              Remover
            </Button>
          </div>
          {fields.map((field) => (
            <label
              className="flex flex-col gap-1.5 text-xs"
              htmlFor={`cms-${row.id}-${field.name}`}
              key={field.name}
            >
              {field.label}
              {field.multiline ? (
                <Textarea
                  defaultValue={row.values[field.name] ?? ""}
                  id={`cms-${row.id}-${field.name}`}
                  maxLength={field.maxLength}
                  name={field.name}
                  required
                  rows={7}
                />
              ) : (
                <Input
                  defaultValue={row.values[field.name] ?? ""}
                  id={`cms-${row.id}-${field.name}`}
                  maxLength={field.maxLength}
                  name={field.name}
                  pattern={field.pattern}
                  placeholder={field.placeholder}
                  required
                />
              )}
            </label>
          ))}
        </div>
      ))}
      <Button
        className="self-start"
        disabled={state.rows.length >= maximum}
        onClick={state.add}
        size="sm"
        type="button"
        variant="outline"
      >
        <Plus data-icon="inline-start" />
        Adicionar item
      </Button>
      <p className="text-[11px] text-muted-foreground">
        Até {maximum} itens. O conteúdo é exibido como texto, sem HTML.
      </p>
    </fieldset>
  );
}
