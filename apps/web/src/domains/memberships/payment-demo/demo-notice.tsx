import { FlaskConical } from "lucide-react";

export function DemoNotice() {
  return (
    <aside
      aria-label="Modo demonstração"
      className="flex items-start gap-3 rounded-lg border border-primary/25 bg-accent/50 p-4"
    >
      <FlaskConical
        aria-hidden="true"
        className="mt-0.5 size-5 shrink-0 text-primary"
      />
      <div>
        <p className="font-semibold text-primary text-sm">Modo demonstração</p>
        <p className="mt-1 text-sm leading-6">
          Use somente os dados de teste indicados. Nenhuma cobrança será feita e
          nenhum conteúdo exclusivo será liberado.
        </p>
      </div>
    </aside>
  );
}
