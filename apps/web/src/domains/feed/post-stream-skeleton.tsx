import { Skeleton } from "@privana/ui/components/skeleton";

export function PostStreamSkeleton() {
  return (
    <div
      aria-label="Carregando publicações"
      className="flex flex-col"
      role="status"
    >
      {["first", "second"].map((id) => (
        <div className="flex flex-col gap-4 border-b p-4 sm:p-5" key={id}>
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <Skeleton className="h-5 w-32" />
        </div>
      ))}
    </div>
  );
}
