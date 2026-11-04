"use client";

import { Label } from "@privana/ui/components/label";
import { TextField } from "@/shared/components/text-field";
import { usePlatform } from "@/shared/platform/use-platform";

export function StudioCategoryField({
  currentCategory,
}: {
  currentCategory?: string;
}) {
  const config = usePlatform();
  const { categories } = config.discovery;
  if (categories.length === 0) {
    return (
      <TextField
        defaultValue={currentCategory}
        label="Categoria"
        maxLength={60}
        minLength={2}
        name="category"
        placeholder="Categoria principal do seu conteúdo"
        required
      />
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="studio-category">Categoria</Label>
      <select
        className="h-11 rounded-lg border border-input bg-card px-3.5 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/15 md:text-sm"
        defaultValue={currentCategory ?? categories[0]}
        id="studio-category"
        name="category"
        required
      >
        {currentCategory && !categories.includes(currentCategory) ? (
          <option value={currentCategory}>{currentCategory} (atual)</option>
        ) : null}
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}
