import { OperationsSectionNavigation } from "../../src/domains/admin/operations-section-navigation";
import { useOperationsNavigation } from "../../src/domains/admin/use-operations-navigation";

export function WorkspacesReview({ role }: { role: string }) {
  const state = useOperationsNavigation(role);
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-6 p-4 sm:p-8">
      <h1 className="font-heading text-2xl">Seções em revisão</h1>
      <p className="text-muted-foreground">
        Navegação local com papel fictício; nenhuma operação real.
      </p>
      <div className="lg:hidden">
        <OperationsSectionNavigation
          compact
          onSelect={state.select}
          section={state.section}
          viewerRole={role}
        />
      </div>
      <div className="hidden max-w-60 lg:block">
        <OperationsSectionNavigation
          onSelect={state.select}
          section={state.section}
          viewerRole={role}
        />
      </div>
      <p role="status">Seção atual: {state.section}</p>
    </main>
  );
}
