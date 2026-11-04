"use client";

import type { SettingsDTO } from "@privana/api/contracts/product";
import { Button } from "@privana/ui/components/button";
import { Checkbox } from "@privana/ui/components/checkbox";
import { Input } from "@privana/ui/components/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { handleActionError } from "@/domains/feed/handle-action-error";
import { Avatar } from "@/shared/components/avatar";
import { orpc } from "@/utils/orpc";
export function SettingsForm({ settings }: { settings: SettingsDTO }) {
  const [name, setName] = useState(settings.name);
  const [emailNotifications, setEmailNotifications] = useState(
    settings.emailNotifications
  );
  const queryClient = useQueryClient();
  const update = useMutation(
    orpc.settings.update.mutationOptions({
      onError: handleActionError,
      onSuccess: async () => {
        toast.success("Suas preferências foram salvas.");
        await queryClient.invalidateQueries();
      },
    })
  );
  const submitSettings = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      update.mutate({
        emailNotifications,
        locale: "pt-BR",
        name: name.trim(),
      });
    },
    [update, emailNotifications, name]
  );
  const changeName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value),
    []
  );
  const changeEmailNotifications = useCallback(
    (checked: boolean) => setEmailNotifications(checked),
    []
  );
  return (
    <form className="flex flex-col gap-5" onSubmit={submitSettings}>
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
        disabled={update.isPending || name.trim().length < 2}
        type="submit"
      >
        <Save data-icon="inline-start" />
        {update.isPending ? "Salvando…" : "Salvar alterações"}
      </Button>
    </form>
  );
}
