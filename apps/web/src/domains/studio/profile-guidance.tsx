import { ClipboardCheck, ImageIcon, UserRound } from "lucide-react";

export function ProfileGuidance({ existing }: { existing: boolean }) {
  return (
    <aside className="flex flex-col gap-4 rounded-xl border bg-card p-5 xl:self-start">
      <h3 className="font-semibold text-sm">Informações do perfil</h3>
      <div className="flex items-start gap-3">
        <UserRound
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-muted-foreground"
        />
        <p className="text-muted-foreground text-xs leading-relaxed">
          Nome, categoria e descrição ajudam as pessoas a entender seu conteúdo.
        </p>
      </div>
      <div className="flex items-start gap-3">
        <ImageIcon
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-muted-foreground"
        />
        <p className="text-muted-foreground text-xs leading-relaxed">
          Foto, capa e prévias são públicas. Use apenas imagens que podem ser
          vistas por qualquer pessoa.
        </p>
      </div>
      <div className="flex items-start gap-3">
        <ClipboardCheck
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-muted-foreground"
        />
        <p className="text-muted-foreground text-xs leading-relaxed">
          {existing
            ? "As alterações atualizam as informações do seu perfil. O valor mensal é apenas uma referência, sem cobrança automática."
            : "A equipe analisa sua candidatura antes de liberar publicações. Enviar o perfil não cria cobranças ou assinaturas."}
        </p>
      </div>
    </aside>
  );
}
