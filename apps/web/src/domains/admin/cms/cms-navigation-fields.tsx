import type { PlatformConfig } from "@privana/api/contracts/platform";
import { TextField } from "@/shared/components/text-field";
import { type CmsRowField, CmsRows } from "./cms-rows";
import { CmsTextarea } from "./cms-textarea";

const navigationLabels: Record<string, string> = {
  explore: "Explorar",
  home: "Início",
  memberships: "Assinaturas",
  messages: "Mensagens",
  saved: "Salvos",
  studio: "Estúdio",
};
const footerFields: CmsRowField[] = [
  { label: "Texto do link", maxLength: 80, name: "footerLabel" },
  {
    label: "Destino (HTTPS ou caminho local absoluto)",
    maxLength: 2048,
    name: "footerHref",
  },
];

export function CmsNavigationFields({
  config,
  onEdit,
}: {
  config: PlatformConfig;
  onEdit: () => void;
}) {
  return (
    <div className="flex flex-col gap-7">
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 font-semibold text-base">
          Rótulos da navegação
        </legend>
        {Object.entries(config.navigation).map(([key, value]) => (
          <TextField
            defaultValue={value}
            key={key}
            label={navigationLabels[key] ?? key}
            maxLength={80}
            name={`navigation.${key}`}
            required
          />
        ))}
      </fieldset>
      <fieldset className="flex flex-col gap-5">
        <legend className="mb-4 font-semibold text-base">
          Rodapé e suporte
        </legend>
        <CmsTextarea
          label="Texto do rodapé"
          name="footerText"
          value={config.footer.text}
        />
        <TextField
          defaultValue={config.footer.supportEmail}
          label="E-mail de suporte"
          maxLength={254}
          name="supportEmail"
          type="email"
        />
      </fieldset>
      <CmsRows
        fields={footerFields}
        initial={config.footer.links.map((link) => ({
          footerHref: link.href,
          footerLabel: link.label,
        }))}
        maximum={12}
        onEdit={onEdit}
        title="Links do rodapé"
      />
    </div>
  );
}
