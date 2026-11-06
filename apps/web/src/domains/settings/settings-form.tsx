"use client";

import type { SettingsDTO } from "@privana/api/contracts/product";
import { Button } from "@privana/ui/components/button";
import { Checkbox } from "@privana/ui/components/checkbox";
import { Input } from "@privana/ui/components/input";
import { Save } from "lucide-react";
import { Avatar } from "@/shared/components/avatar";
import { useSettingsForm } from "./use-settings-form";
export function SettingsForm({ settings }: { settings: SettingsDTO }) {
  const {
    name,
    emailNotifications,
    changeName,
    changeEmailNotifications,
    dirty,
    submitSettings,
    update,
  } = useSettingsForm(settings);
  const savedStatus = dirty
    ? "Você tem alterações não salvas."
    : "Suas preferências estão atualizadas.";
  const status = update.isPending ? "Salvando suas alterações…" : savedStatus;
  return (
    <form
      aria-busy={update.isPending}
      className="flex flex-col gap-5"
      onSubmit={submitSettings}
    >
      <section className="flex flex-col gap-5 rounded-lg border bg-card p-5">
        <div className="flex items-center gap-4">
          <Avatar name={name} size={64} src={settings.image} />
          <div>
            <h2 className="font-semibold text-base">Seu perfil</h2>
            <p className="text-muted-foreground text-sm">
              Como você aparece para suas conexões.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm" htmlFor="settings-name">
            Seu nome
          </label>
          <Input
            autoComplete="name"
            disabled={update.isPending}
            id="settings-name"
            maxLength={80}
            minLength={2}
            onChange={changeName}
            required
            value={name}
          />
        </div>
      </section>
      <section className="flex flex-col gap-5 rounded-lg border bg-card p-5">
        <div>
          <h2 className="font-semibold text-base">Notificações por email</h2>
          <p className="mt-1 text-muted-foreground text-sm">
            Escolha como acompanhar as novidades.
          </p>
        </div>
        <label
          className="flex cursor-pointer items-start gap-3 rounded-lg border p-4"
          htmlFor="email-notifications"
        >
          <Checkbox
            checked={emailNotifications}
            className="mt-1 rounded"
            disabled={update.isPending}
            id="email-notifications"
            onCheckedChange={changeEmailNotifications}
          />
          <span>
            <span className="block font-medium text-sm">
              Novidades por email
            </span>
            <span className="mt-1 block text-muted-foreground text-sm leading-relaxed">
              Salve sua preferência para receber novidades quando os avisos de
              criadores estiverem disponíveis.
            </span>
          </span>
        </label>
        <p className="text-muted-foreground text-xs">
          Mensagens essenciais de segurança da conta continuam sendo enviadas.
        </p>
      </section>
      <Button
        className="self-start"
        disabled={update.isPending || name.trim().length < 2 || !dirty}
        type="submit"
      >
        <Save data-icon="inline-start" />
        {update.isPending ? "Salvando…" : "Salvar alterações"}
      </Button>
      {update.isError ? (
        <p className="text-destructive text-sm" role="alert">
          Não foi possível salvar. Suas alterações continuam no formulário para
          tentar novamente.
        </p>
      ) : null}
      <p aria-live="polite" className="text-muted-foreground text-xs">
        {status}
      </p>
    </form>
  );
}
