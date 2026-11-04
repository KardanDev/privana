import type { PlatformConfig } from "@privana/api/contracts/platform";
import { TextField } from "@/shared/components/text-field";

export function CmsBrandFields({ config }: { config: PlatformConfig }) {
  return (
    <fieldset className="flex flex-col gap-5">
      <legend className="mb-4 font-semibold text-base">
        Identidade da plataforma
      </legend>
      <TextField
        defaultValue={config.brand.name}
        label="Nome"
        maxLength={80}
        name="brandName"
        required
      />
      <TextField
        defaultValue={config.brand.tagline}
        label="Descrição curta"
        maxLength={160}
        name="brandTagline"
      />
      <TextField
        defaultValue={config.brand.logoUrl}
        hint="HTTPS ou caminho local absoluto. Deixe vazio para usar a marca padrão."
        label="Endereço do logotipo"
        maxLength={2048}
        name="brandLogo"
      />
      <TextField
        defaultValue={config.brand.accentColor}
        hint="Hexadecimal de seis dígitos. A cor precisa ter contraste de pelo menos 4,5:1 com branco."
        label="Cor principal"
        maxLength={7}
        name="brandColor"
        pattern="#[0-9a-fA-F]{6}"
        placeholder="#6D28D9"
        required
      />
    </fieldset>
  );
}
