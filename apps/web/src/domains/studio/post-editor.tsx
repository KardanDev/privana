"use client";
import type { PostDTO } from "@privana/api/contracts/product";
import { Button } from "@privana/ui/components/button";
import { Label } from "@privana/ui/components/label";
import { Textarea } from "@privana/ui/components/textarea";
import { LoaderCircle, Send, X } from "lucide-react";
import { TextField } from "@/shared/components/text-field";
import { StudioMediaField } from "./studio-media-field";
import { usePostForm } from "./use-post-form";
export function PostEditor({
  post,
  onClose,
}: {
  post?: PostDTO;
  onClose: () => void;
}) {
  const form = usePostForm(post, onClose);
  return (
    <section
      aria-labelledby="post-editor-title"
      className="rounded-xl border bg-card p-5 sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-lg" id="post-editor-title">
          {post ? "Editar publicação" : "Nova publicação"}
        </h2>
        <Button
          aria-label="Fechar editor"
          disabled={form.pending}
          onClick={onClose}
          size="icon"
          variant="ghost"
        >
          <X aria-hidden="true" />
        </Button>
      </div>
      <form
        aria-busy={form.pending}
        className="flex flex-col gap-5"
        onSubmit={form.onSubmit}
      >
        <fieldset
          aria-label="Conteúdo da publicação"
          className="flex min-w-0 flex-col gap-5"
          disabled={form.pending}
        >
          <TextField
            defaultValue={post?.title}
            label="Título"
            maxLength={160}
            name="title"
            placeholder="Título da publicação"
            required
          />
          <TextField
            defaultValue={post?.excerpt}
            hint="Visível para todos, inclusive em publicações exclusivas."
            label="Prévia pública"
            maxLength={500}
            name="excerpt"
            placeholder="Um resumo do que você vai compartilhar"
          />
          <div className="flex flex-col gap-2">
            <Label htmlFor="post-body">Sua publicação</Label>
            <Textarea
              defaultValue={post?.body ?? ""}
              id="post-body"
              maxLength={50_000}
              name="body"
              placeholder="Escreva sua publicação…"
              required
              rows={7}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="visibility">Quem pode ver?</Label>
              <select
                aria-describedby="visibility-hint"
                className="h-11 rounded-lg border border-input bg-card px-3.5 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/15 md:text-sm"
                defaultValue={post?.visibility ?? "PUBLIC"}
                id="visibility"
                name="visibility"
              >
                <option value="PUBLIC">Todos · publicação pública</option>
                <option value="SUBSCRIBERS">
                  Somente assinantes · exclusivo
                </option>
              </select>
              <p
                className="text-muted-foreground text-xs leading-relaxed"
                id="visibility-hint"
              >
                Publicações exclusivas exigem acesso ativo. O checkout de
                demonstração não libera esse acesso.
              </p>
            </div>
            <TextField
              defaultValue={post?.previewUrl ?? ""}
              hint="Imagem pública opcional. Nunca use uma mídia exclusiva aqui."
              label="Imagem de prévia (link HTTPS)"
              name="previewUrl"
              placeholder="https://..."
              type="url"
            />
          </div>
          <StudioMediaField hasMedia={Boolean(post?.mediaUrl)} />
        </fieldset>
        {form.error ? (
          <p className="text-destructive text-sm" role="alert">
            {form.error}
          </p>
        ) : null}
        <div className="flex flex-wrap justify-end gap-3">
          <Button
            disabled={form.pending}
            name="status"
            type="submit"
            value="DRAFT"
            variant="outline"
          >
            Salvar rascunho
          </Button>
          <Button
            disabled={form.pending}
            name="status"
            type="submit"
            value="PUBLISHED"
          >
            {form.pending ? (
              <LoaderCircle aria-hidden="true" className="animate-spin" />
            ) : (
              <Send aria-hidden="true" />
            )}
            {form.pending ? "Salvando…" : "Publicar"}
          </Button>
        </div>
      </form>
    </section>
  );
}
