import { Button } from "@privana/ui/components/button";
import Link from "next/link";
import { EmptyState } from "@/shared/components/empty-state";
export default function NotFound() {
  return (
    <EmptyState
      description="Esse espaço não está disponível. Que tal descobrir algo novo?"
      title="Parece que você se perdeu"
    >
      <Button render={<Link href="/" />}>Voltar a explorar</Button>
    </EmptyState>
  );
}
