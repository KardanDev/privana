import type { ViewerDTO } from "@privana/api/contracts/product";
import { MobileNavigation } from "../../src/shared/layout/mobile-navigation";
import { Sidebar } from "../../src/shared/layout/sidebar";
import { Topbar } from "../../src/shared/layout/topbar";

export function NavigationReview({
  viewer,
}: {
  viewer: ViewerDTO | null | undefined;
}) {
  return (
    <>
      <Sidebar viewer={viewer} />
      <div className="min-h-svh pb-24 lg:ml-[88px] xl:ml-[216px]">
        <Topbar viewer={viewer} />
        <main className="p-6">
          <h1 className="font-heading text-3xl">Navegação em revisão</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Conta fictícia, componentes reais e apresentação estática. As ações
            de conta não estão conectadas e os destinos são exemplos locais.
          </p>
        </main>
      </div>
      <MobileNavigation viewer={viewer} />
    </>
  );
}
