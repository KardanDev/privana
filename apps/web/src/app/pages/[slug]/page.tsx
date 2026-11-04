import { notFound } from "next/navigation";
import { connection } from "next/server";
import { loadPlatform } from "@/shared/platform/load-platform";

export default async function InformationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const [{ slug }, config] = await Promise.all([params, loadPlatform()]);
  const page = config.pages.find((entry) => entry.slug === slug);
  if (!page) {
    notFound();
  }
  return (
    <article className="mx-auto max-w-2xl py-6">
      <p className="mb-3 font-medium text-primary text-sm">
        {config.brand.name}
      </p>
      <h1 className="mb-8 font-semibold text-3xl tracking-tight">
        {page.title}
      </h1>
      <div className="whitespace-pre-wrap break-words text-[15px] leading-8">
        {page.body}
      </div>
    </article>
  );
}
