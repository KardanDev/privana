import { Button } from "@privana/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@privana/ui/components/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@privana/ui/components/tooltip";
import { Info } from "lucide-react";
import { useCallback, useState } from "react";

export function ReviewActions() {
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [notice, setNotice] = useState("");
  const preview = useCallback(
    () =>
      setNotice(
        "Prévia selecionada. Exemplo local, sem alteração na plataforma."
      ),
    []
  );
  const discard = useCallback(
    () =>
      setNotice("Exemplo local descartado. Nenhum conteúdo real foi removido."),
    []
  );
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            Opções da publicação de exemplo
          </DropdownMenuTrigger>
          <DropdownMenuContent aria-label="Opções da publicação de exemplo">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                Maria de Oliveira e Albuquerque · Exemplo
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={preview}>
                Ver prévia com o nome completo e as preferências de privacidade
              </DropdownMenuItem>
              <DropdownMenuCheckboxItem
                checked={emailUpdates}
                onCheckedChange={setEmailUpdates}
              >
                Receber novidades por e-mail
              </DropdownMenuCheckboxItem>
              <DropdownMenuItem disabled>
                Publicar em produção (indisponível no exemplo)
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={discard} variant="destructive">
                Descartar exemplo local
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  aria-label="Exemplos locais; nenhuma ação altera contas ou pagamentos."
                  size="icon"
                  variant="ghost"
                />
              }
            >
              <Info />
            </TooltipTrigger>
            <TooltipContent>
              Exemplos locais; nenhuma ação altera contas ou pagamentos.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {notice ? (
        <p className="text-muted-foreground text-sm" role="status">
          {notice}
        </p>
      ) : null}
    </div>
  );
}
