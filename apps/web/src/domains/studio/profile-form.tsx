"use client";
import type { CreatorDTO } from "@privana/api/contracts/product";
import { Button } from "@privana/ui/components/button";
import { Label } from "@privana/ui/components/label";
import { Textarea } from "@privana/ui/components/textarea";
import { LoaderCircle, Save } from "lucide-react";
import { TextField } from "@/shared/components/text-field";
import { usePlatform } from "@/shared/platform/use-platform";
import { CreatorApplicationClosed } from "./creator-application-closed";
import { ProfileGuidance } from "./profile-guidance";
import { StudioCategoryField } from "./studio-category-field";
import { useProfileForm } from "./use-profile-form";

export function ProfileForm({ profile }: { profile: CreatorDTO | null }) {
  const form = useProfileForm(profile);
  const config = usePlatform();
  const disabled = form.pending || profile?.status === "SUSPENDED";
  const submitLabel = profile ? "Salvar alterações" : "Enviar candidatura";
  const buttonLabel = form.pending ? "Salvando perfil…" : submitLabel;
  if (!(profile || config.features.creatorApplications)) {
    return <CreatorApplicationClosed />;
  }
  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_260px]">
      <form
        aria-busy={form.pending}
        className="flex flex-col gap-5 rounded-xl border bg-card p-5 sm:p-6"
        onSubmit={form.onSubmit}
      >
        <div>
          <h2 className="font-semibold text-lg">
            {profile ? "Perfil de criador" : "Solicitar perfil de criador"}
          </h2>
          <p className="mt-2 text-muted-foreground text-sm">
            {profile
              ? "Atualize as informações exibidas no seu perfil público."
              : "Preencha suas informações para enviar uma candidatura à equipe."}
          </p>
        </div>
        <fieldset
          aria-label="Informações do perfil"
          className="flex min-w-0 flex-col gap-5"
          disabled={disabled}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              defaultValue={profile?.displayName}
              label="Nome de exibição"
              maxLength={80}
              minLength={2}
              name="displayName"
              placeholder="Seu nome ou nome artístico"
              required
            />
            <TextField
              defaultValue={profile?.handle}
              hint="Letras minúsculas, números, hífen ou sublinhado."
              label="Seu @usuário"
              maxLength={40}
              minLength={3}
              name="handle"
              pattern="[a-z0-9_-]+"
              placeholder="seunome"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="bio">Sobre você</Label>
            <Textarea
              defaultValue={profile?.bio}
              id="bio"
              maxLength={2000}
              name="bio"
              placeholder="Descreva o conteúdo que você produz."
              rows={4}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <StudioCategoryField currentCategory={profile?.category} />
            <TextField
              defaultValue={profile?.location}
              label="Localização"
              maxLength={120}
              name="location"
              placeholder="São Paulo, Brasil"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              defaultValue={profile?.avatarUrl ?? ""}
              hint="Link HTTPS de uma imagem pública."
              label="Foto do perfil"
              name="avatarUrl"
              placeholder="https://..."
              type="url"
            />
            <TextField
              defaultValue={profile?.coverUrl ?? ""}
              label="Imagem de capa"
              name="coverUrl"
              placeholder="https://..."
              type="url"
            />
          </div>
          <TextField
            defaultValue={profile ? profile.monthlyPriceCents / 100 : 0}
            hint="Valor de referência. Não cria cobranças nem habilita pagamentos."
            label="Valor mensal planejado (R$)"
            max={10_000}
            min={0}
            name="price"
            required
            step="0.01"
            type="number"
          />
        </fieldset>
        {form.error ? (
          <p className="text-destructive text-sm" role="alert">
            {form.error}
          </p>
        ) : null}
        {profile?.status === "SUSPENDED" ? (
          <p className="text-muted-foreground text-sm" role="status">
            A edição fica indisponível enquanto o perfil estiver suspenso.
          </p>
        ) : null}
        <Button className="self-start" disabled={disabled} type="submit">
          {form.pending ? (
            <LoaderCircle aria-hidden="true" className="animate-spin" />
          ) : (
            <Save aria-hidden="true" />
          )}
          {buttonLabel}
        </Button>
      </form>
      <ProfileGuidance existing={Boolean(profile)} />
    </div>
  );
}
