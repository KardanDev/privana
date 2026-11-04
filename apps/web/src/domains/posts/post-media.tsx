import Image from "next/image";

export function PostMedia({
  locked,
  mediaType,
  mediaUrl,
  previewUrl,
  title,
}: {
  locked: boolean;
  mediaType: string | null;
  mediaUrl: string | null;
  previewUrl: string | null;
  title: string;
}) {
  if (!locked && mediaType === "video/mp4" && mediaUrl) {
    return (
      // biome-ignore lint/a11y/useMediaCaption: Uploaded videos do not yet have caption assets; do not fabricate captions. Native controls, title, and a fallback remain available.
      <video
        aria-label={title}
        className="aspect-[4/3] w-full bg-muted object-contain"
        controls
        playsInline
        poster={previewUrl ?? undefined}
        preload="metadata"
        title={title}
      >
        <source src={mediaUrl} type="video/mp4" />
        Seu navegador não conseguiu reproduzir este vídeo.{" "}
        <a href={mediaUrl}>Abrir vídeo: {title}</a>.
      </video>
    );
  }
  const image = locked
    ? previewUrl
    : ((mediaType?.startsWith("image/") ? mediaUrl : null) ?? previewUrl);
  if (!image) {
    return null;
  }
  return (
    <div className="relative aspect-[4/3] bg-muted">
      <Image
        alt={title}
        className="object-cover"
        fill
        sizes="(max-width: 1024px) 100vw, 65vw"
        src={image}
        unoptimized
      />
    </div>
  );
}
