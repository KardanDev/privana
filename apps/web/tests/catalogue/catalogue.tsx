import { Checkbox } from "@privana/ui/components/checkbox";
import { Label } from "@privana/ui/components/label";
import { NativeSelect } from "@privana/ui/components/native-select";
import { type ChangeEvent, useCallback, useState } from "react";
import { ControlsReview } from "../fixtures/controls-review";
import { FeedbackReview } from "../fixtures/feedback-review";
import { ContentPrimitives } from "./content-primitives";
import { useCatalogueTheme } from "./use-catalogue-theme";

export function Catalogue() {
  const [example, setExample] = useState("controls");
  const { accent, dark, setAccent, setDark } = useCatalogueTheme();
  const changeExample = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => setExample(event.target.value),
    []
  );
  const changeAccent = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => setAccent(event.target.value),
    [setAccent]
  );
  return (
    <>
      <header className="border-border border-b bg-card px-6 py-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-5">
          <div>
            <p className="font-heading font-semibold text-2xl">
              Privana · Componentes
            </p>
            <p className="max-w-prose text-muted-foreground text-sm">
              Revisão local da interface. Dados fictícios; nenhuma alteração é
              enviada à plataforma. Edite os arquivos do catálogo e reinicie
              para atualizar.
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
            <div className="flex min-w-0 flex-col gap-2">
              <Label htmlFor="catalogue-example">Exemplo</Label>
              <NativeSelect
                id="catalogue-example"
                onChange={changeExample}
                value={example}
              >
                <option value="controls">Controles e formulários</option>
                <option value="feedback">Menus, estados e dados</option>
                <option value="content">Conteúdo e indicadores</option>
              </NativeSelect>
            </div>
            <div className="flex min-w-0 flex-col gap-2">
              <Label htmlFor="catalogue-accent">Cor de destaque</Label>
              <NativeSelect
                id="catalogue-accent"
                onChange={changeAccent}
                value={accent}
              >
                <option value="#6D28D9">Roxo Privana</option>
                <option value="#1D4ED8">Azul · exemplo CMS</option>
                <option value="#000000">Preto · exemplo CMS</option>
              </NativeSelect>
            </div>
            <div className="flex min-h-11 items-center gap-2">
              <Checkbox
                checked={dark}
                id="catalogue-dark"
                onCheckedChange={setDark}
              />
              <Label htmlFor="catalogue-dark">Tema escuro</Label>
            </div>
          </div>
        </div>
      </header>
      <div hidden={example !== "controls"}>
        <ControlsReview />
      </div>
      <div hidden={example !== "feedback"}>
        <FeedbackReview localPreview />
      </div>
      <div hidden={example !== "content"}>
        <ContentPrimitives />
      </div>
      <footer className="mx-auto max-w-4xl px-6 py-8 text-muted-foreground text-sm">
        Preferências temporárias neste navegador.{" "}
        <a className="underline underline-offset-4" href="/font-licenses.txt">
          Licenças das fontes
        </a>
      </footer>
    </>
  );
}
