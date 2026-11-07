import { file } from "bun";
import { previewFiles } from "./files.mjs";

export async function respond(request) {
  const headers = {
    "Cache-Control": "no-store",
    "Content-Security-Policy":
      "default-src 'none'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' https://images.unsplash.com; connect-src 'none'; form-action 'none'; frame-ancestors 'none'; base-uri 'none'",
    "X-Content-Type-Options": "nosniff",
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", { headers, status: 405 });
  }
  const path = previewFiles.get(new URL(request.url).pathname);
  if (!path) {
    return new Response("Not found", { headers, status: 404 });
  }
  const resource = file(path);
  if (!(await resource.exists())) {
    return new Response("Not found", { headers, status: 404 });
  }
  return new Response(request.method === "HEAD" ? null : resource, {
    headers: { ...headers, "Content-Type": resource.type },
  });
}
