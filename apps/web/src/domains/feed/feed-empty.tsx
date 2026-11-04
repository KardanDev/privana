import { Button } from "@privana/ui/components/button";
import { Bookmark, Compass } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/shared/components/empty-state";

export function FeedEmpty({ saved }: { saved: boolean }) {
  return (
    <EmptyState
      description={
        saved
          ? "Toque no ícone de salvar em uma publicação para encontrá-la aqui depois."
          : "Siga criadores que combinam com você. As publicações deles aparecerão neste espaço."
      }
      icon={saved ? Bookmark : Compass}
      title={
        saved ? "Boas ideias merecem ficar" : "Seu feed começa com uma conexão"
      }
    >
      <Button nativeButton={false} render={<Link href="/" />}>
        Explorar criadores
      </Button>
    </EmptyState>
  );
}
