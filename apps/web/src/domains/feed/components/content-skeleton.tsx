import { Skeleton } from "@privana/ui/components/skeleton";
export function ContentSkeleton() {
  return (
    <div
      aria-label="Carregando conteúdo"
      className="grid gap-4 sm:grid-cols-2"
      role="status"
    >
      {["a", "b", "c"].map((key) => (
        <div className="flex flex-col gap-4" key={key}>
          <Skeleton className="aspect-[2/1] rounded-lg" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
