import type { PlatformConfig } from "@privana/api/contracts/platform";
import { TextField } from "@/shared/components/text-field";
import { CmsTextarea } from "./cms-textarea";

export function CmsContentFields({ config }: { config: PlatformConfig }) {
  return (
    <div className="flex flex-col gap-7">
      <fieldset className="flex flex-col gap-5">
        <legend className="mb-4 font-semibold text-base">Descoberta</legend>
        <TextField
          defaultValue={config.discovery.title}
          label="Título"
          maxLength={120}
          name="discoveryTitle"
          required
        />
        <CmsTextarea
          label="Descrição"
          name="discoveryDescription"
          value={config.discovery.description}
        />
        <CmsTextarea
          hint="Uma categoria por linha, até 24. As opções aparecem na descoberta e no formulário de criador. Alterar ou remover uma opção não muda a categoria dos perfis existentes."
          label="Categorias"
          maximum={2000}
          name="categories"
          value={config.discovery.categories.join("\n")}
        />
        <CmsTextarea
          hint="Um @usuário por linha. Até 24 perfis; apenas perfis públicos ativos podem aparecer."
          label="Perfis em destaque"
          maximum={1200}
          name="featuredHandles"
          value={config.discovery.featuredHandles.join("\n")}
        />
      </fieldset>
      <fieldset className="flex flex-col gap-5">
        <legend className="mb-4 font-semibold text-base">
          Aviso da plataforma
        </legend>
        <TextField
          defaultValue={config.announcement.text}
          hint="Deixe o texto vazio para ocultar o aviso."
          label="Texto do aviso"
          maxLength={240}
          name="announcementText"
        />
        <TextField
          defaultValue={config.announcement.href}
          label="Destino opcional"
          maxLength={2048}
          name="announcementHref"
        />
      </fieldset>
      <fieldset className="flex flex-col gap-5">
        <legend className="mb-4 font-semibold text-base">
          Boas-vindas na autenticação
        </legend>
        <TextField
          defaultValue={config.auth.title}
          label="Título"
          maxLength={120}
          name="authTitle"
          required
        />
        <CmsTextarea
          label="Descrição"
          name="authDescription"
          value={config.auth.description}
        />
      </fieldset>
    </div>
  );
}
