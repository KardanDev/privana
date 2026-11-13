import { Button } from "@privana/ui/components/button";
import { Checkbox } from "@privana/ui/components/checkbox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@privana/ui/components/input-group";
import { Label } from "@privana/ui/components/label";
import { NativeSelect } from "@privana/ui/components/native-select";
import { Textarea } from "@privana/ui/components/textarea";
import { Eye, LoaderCircle } from "lucide-react";
import { type FormEvent, useCallback, useRef, useState } from "react";
import { TextField } from "../../src/shared/components/text-field";

export function ControlsReview() {
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [submits, setSubmits] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const showError = useCallback(
    () => setError("Não foi possível salvar. Revise o nome e tente novamente."),
    []
  );
  const retry = useCallback(() => {
    setError(undefined);
    setPending(false);
    inputRef.current?.focus();
  }, []);
  const submit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!pending) {
        setSubmits((count) => count + 1);
        setPending(true);
      }
    },
    [pending]
  );
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
      <header>
        <h1 className="font-semibold text-3xl">Controles em revisão</h1>
        <p className="text-muted-foreground text-sm">
          Exemplos fictícios · Nenhum dado é enviado
        </p>
      </header>
      <form className="flex flex-col gap-5" onSubmit={submit}>
        <TextField
          aria-describedby="extra-context"
          defaultValue="Maria de Oliveira e Albuquerque"
          error={error}
          hint="Use o nome que você quer mostrar no seu perfil."
          id="review-name"
          label="Nome público"
          name="displayName"
          ref={inputRef}
        />
        <p className="text-muted-foreground text-sm" id="extra-context">
          Seu e-mail continua privado.
        </p>
        <TextField
          hint="Campo com ID gerado, sem repetir o anterior."
          label="Nome alternativo"
          name="displayName"
        />
        <TextField
          defaultValue="Disponível após a análise"
          disabled
          label="Campo indisponível"
        />
        <div className="flex flex-col gap-2">
          <Label htmlFor="review-bio">Sobre meu trabalho</Label>
          <Textarea
            defaultValue="Compartilho bastidores, processos e novidades com quem acompanha meu trabalho."
            id="review-bio"
            placeholder="Conte às pessoas o que você cria"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="review-currency">Moeda da demonstração</Label>
          <NativeSelect defaultValue="BRL" id="review-currency">
            <option value="BRL">BRL · Real brasileiro</option>
            <option value="EUR">EUR · Euro</option>
          </NativeSelect>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="review-checkbox" name="emailUpdates" value="yes" />
          <Label htmlFor="review-checkbox">
            Quero receber novidades por e-mail sobre os criadores que acompanho
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            aria-label="Preferências parcialmente selecionadas"
            id="review-mixed"
            indeterminate
          />
          <span className="text-sm">
            Preferências parcialmente selecionadas
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="review-group">Buscar no conteúdo</Label>
          <InputGroup>
            <InputGroupInput
              id="review-group"
              placeholder="Título ou nome do criador"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton aria-label="Mostrar busca" size="icon-xs">
                <Eye />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={showError} type="button" variant="outline">
            Mostrar erro de exemplo
          </Button>
          <Button onClick={retry} type="button" variant="secondary">
            Voltar ao nome público
          </Button>
          <Button size="xs" type="button">
            Ação compacta
          </Button>
          <Button aria-label="Prévia do perfil" size="icon-xs" type="button">
            <Eye />
          </Button>
        </div>
        <Button aria-busy={pending} disabled={pending} type="submit">
          {pending ? (
            <>
              <LoaderCircle className="animate-spin" data-icon="inline-start" />{" "}
              Salvando alterações…
            </>
          ) : (
            "Salvar alterações e manter minhas preferências de privacidade"
          )}
        </Button>
        <p className="text-muted-foreground text-sm" role="status">
          Envios locais: {submits}. Nenhuma solicitação à plataforma.
        </p>
      </form>
    </main>
  );
}
