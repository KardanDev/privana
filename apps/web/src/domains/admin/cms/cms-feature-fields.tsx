import type { PlatformConfig } from "@privana/api/contracts/platform";

export function CmsFeatureFields({ config }: { config: PlatformConfig }) {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-4 font-semibold text-base">
        Disponibilidade de recursos
      </legend>
      <p className="text-muted-foreground text-sm">
        Os controles entram em vigor após a publicação e também são verificados
        pelo servidor.
      </p>
      <label className="flex items-start gap-3 rounded-lg border p-4">
        <input
          className="mt-1 accent-primary"
          defaultChecked={config.features.registration}
          name="featureRegistration"
          type="checkbox"
        />
        <span>
          <span className="block font-medium text-sm">Novos cadastros</span>
          <span className="mt-1 block text-muted-foreground text-xs">
            Permitir que novas pessoas criem uma conta.
          </span>
        </span>
      </label>
      <label className="flex items-start gap-3 rounded-lg border p-4">
        <input
          className="mt-1 accent-primary"
          defaultChecked={config.features.creatorApplications}
          name="featureCreators"
          type="checkbox"
        />
        <span>
          <span className="block font-medium text-sm">
            Novas candidaturas de criadores
          </span>
          <span className="mt-1 block text-muted-foreground text-xs">
            Perfis já existentes continuam podendo editar suas informações.
          </span>
        </span>
      </label>
      <label className="flex items-start gap-3 rounded-lg border p-4">
        <input
          className="mt-1 accent-primary"
          defaultChecked={config.features.messaging}
          name="featureMessaging"
          type="checkbox"
        />
        <span>
          <span className="block font-medium text-sm">Envio de mensagens</span>
          <span className="mt-1 block text-muted-foreground text-xs">
            O histórico de conversas permanece disponível quando o envio é
            desativado.
          </span>
        </span>
      </label>
    </fieldset>
  );
}
