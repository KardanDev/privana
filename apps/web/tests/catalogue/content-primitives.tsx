import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@privana/ui/components/card";
import { Users } from "lucide-react";
import { StatCard } from "../../src/shared/components/stat-card";

export function ContentPrimitives() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-8">
      <header>
        <h1 className="font-semibold text-3xl">Conteúdo em revisão</h1>
        <p className="text-muted-foreground text-sm">
          Card e StatCard reais. Valores ilustrativos, sem receita ou pessoas
          reais.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Bastidores de Maria de Oliveira e Albuquerque</CardTitle>
          <CardDescription>
            Descrição de exemplo com um nome longo e informações em português do
            Brasil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Um espaço para acompanhar processos criativos, conversar e descobrir
            novas publicações. Este conteúdo existe apenas para conferir
            legibilidade, espaçamento e quebra de texto.
          </p>
        </CardContent>
      </Card>
      <StatCard
        detail="Valor fictício para conferir a leitura dos indicadores no celular."
        icon={Users}
        label="Pessoas acompanhando este exemplo"
        value={12_345}
      />
    </main>
  );
}
