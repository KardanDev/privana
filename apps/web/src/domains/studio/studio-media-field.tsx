import { Label } from "@privana/ui/components/label";
import { FileUp, Paperclip } from "lucide-react";

export function StudioMediaField({ hasMedia }: { hasMedia: boolean }) {
  return (
    <div className="rounded-lg border border-dashed bg-muted/30 p-4">
      <Label className="mb-3 flex items-center gap-2" htmlFor="post-media">
        <FileUp aria-hidden="true" className="size-4 text-muted-foreground" />
        {hasMedia ? "Substituir foto ou vídeo" : "Adicionar foto ou vídeo"}
      </Label>
      <input
        accept="image/jpeg,image/png,image/webp,video/mp4"
        aria-describedby="post-media-hint"
        className="max-w-full rounded-lg text-sm outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-accent file:px-3 file:py-2 file:font-medium file:text-primary focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        id="post-media"
        name="media"
        type="file"
      />
      <p
        className="mt-3 text-muted-foreground text-xs leading-relaxed"
        id="post-media-hint"
      >
        JPG, PNG, WebP ou MP4, até 100 MB. O acesso ao arquivo acompanha a
        visibilidade da publicação.
      </p>
      {hasMedia ? (
        <p className="mt-3 flex items-start gap-2 text-muted-foreground text-xs">
          <Paperclip aria-hidden="true" className="size-3.5 shrink-0" />A mídia
          atual será mantida se você não escolher outro arquivo.
        </p>
      ) : null}
    </div>
  );
}
