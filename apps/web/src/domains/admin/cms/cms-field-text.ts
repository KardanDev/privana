export function cmsFieldText(data: FormData, name: string): string {
  return String(data.get(name) ?? "").trim();
}
