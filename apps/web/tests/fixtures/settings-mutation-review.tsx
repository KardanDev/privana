import type { SettingsDTO } from "@privana/api/contracts/product";
import { Button } from "@privana/ui/components/button";
import { Input } from "@privana/ui/components/input";
import { useSettingsForm } from "../../src/domains/settings/use-settings-form";

export function SettingsMutationReview({
  settings,
}: {
  settings: SettingsDTO;
}) {
  const state = useSettingsForm(settings);
  return (
    <form
      aria-busy={state.update.isPending}
      className="flex flex-col gap-3"
      onSubmit={state.submitSettings}
    >
      <label htmlFor="review-name">Seu nome</label>
      <Input
        disabled={state.update.isPending}
        id="review-name"
        minLength={2}
        onChange={state.changeName}
        required
        value={state.name}
      />
      <Button disabled={state.update.isPending || !state.dirty} type="submit">
        Salvar em revisão
      </Button>
      {state.update.isError ? (
        <p className="text-destructive" role="alert">
          Não foi possível salvar.
        </p>
      ) : null}
    </form>
  );
}
