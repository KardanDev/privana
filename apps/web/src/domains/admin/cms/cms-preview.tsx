import type { PlatformConfig } from "@privana/api/contracts/platform";
import Image from "next/image";

export function CmsPreview({ config }: { config: PlatformConfig }) {
  return (
    <section
      aria-label="Prévia local do rascunho"
      className="overflow-hidden rounded-xl border border-t-4 bg-card"
      style={{ borderTopColor: config.brand.accentColor }}
    >
      <header className="border-b bg-muted/30 p-4">
        <h2 className="font-semibold text-sm">Prévia local do rascunho</h2>
        <p className="mt-1 text-muted-foreground text-xs">
          Esta visualização não altera a plataforma pública e não inclui
          publicações de demonstração.
        </p>
      </header>
      <div className="flex flex-col gap-6 p-5">
        <div className="flex items-center gap-3">
          {config.brand.logoUrl ? (
            <Image
              alt={config.brand.name}
              className="size-10 rounded-lg object-contain"
              height={40}
              src={config.brand.logoUrl}
              unoptimized
              width={40}
            />
          ) : null}
          <div>
            <p
              className="font-semibold text-xl"
              style={{ color: config.brand.accentColor }}
            >
              {config.brand.name}
            </p>
            <p className="text-muted-foreground text-xs">
              {config.brand.tagline}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 border-y py-3 text-xs">
          {Object.entries(config.navigation).map(([key, label]) => (
            <span key={key}>{label}</span>
          ))}
        </div>
        {config.announcement.text ? (
          <p className="rounded-lg bg-accent p-3 text-sm">
            {config.announcement.text}
            {config.announcement.href ? (
              <span className="mt-1 block break-all text-xs">
                Destino: {config.announcement.href}
              </span>
            ) : null}
          </p>
        ) : null}
        <div>
          <h3 className="font-semibold text-lg">{config.discovery.title}</h3>
          <p className="mt-2 whitespace-pre-wrap break-words text-muted-foreground text-sm">
            {config.discovery.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {config.discovery.categories.map((category) => (
              <span
                className="rounded-full border px-3 py-1 text-xs"
                key={category}
              >
                {category}
              </span>
            ))}
          </div>
          {config.discovery.featuredHandles.length > 0 ? (
            <p className="mt-4 text-muted-foreground text-xs">
              Perfis configurados:{" "}
              {config.discovery.featuredHandles
                .map((handle) => `@${handle}`)
                .join(", ")}
            </p>
          ) : null}
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium text-sm">{config.auth.title}</h3>
          <p className="mt-2 text-muted-foreground text-xs">
            {config.auth.description}
          </p>
        </div>
        <div>
          <h3 className="font-medium text-sm">Páginas públicas</h3>
          {config.pages.length === 0 ? (
            <p className="mt-2 text-muted-foreground text-xs">
              Nenhuma página configurada.
            </p>
          ) : (
            config.pages.map((page) => (
              <details className="mt-3 rounded-lg border p-3" key={page.slug}>
                <summary className="cursor-pointer text-sm">
                  {page.title}{" "}
                  <span className="text-muted-foreground text-xs">
                    /pages/{page.slug}
                  </span>
                </summary>
                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-relaxed [overflow-wrap:anywhere]">
                  {page.body}
                </p>
              </details>
            ))
          )}
        </div>
        <p className="text-muted-foreground text-xs">
          Cadastro: {config.features.registration ? "aberto" : "fechado"} ·
          Candidaturas:{" "}
          {config.features.creatorApplications ? "abertas" : "fechadas"} ·
          Mensagens:{" "}
          {config.features.messaging
            ? "envio habilitado"
            : "envio desabilitado"}
        </p>
        <footer className="border-t pt-4 text-muted-foreground text-xs">
          <p>{config.footer.text}</p>
          <p className="mt-2">{config.footer.supportEmail}</p>
          {config.footer.links.map((link) => (
            <p className="mt-2 break-all" key={`${link.label}-${link.href}`}>
              {link.label} · {link.href}
            </p>
          ))}
        </footer>
      </div>
    </section>
  );
}
