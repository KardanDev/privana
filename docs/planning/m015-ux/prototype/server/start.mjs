import { serve } from "bun";
import { respond } from "./respond.mjs";

const port = Number(process.argv[2] ?? 53_470);
if (!Number.isInteger(port) || port < 1024 || port > 65_535) {
  throw new Error("Use a local preview port between 1024 and 65535.");
}
const server = serve({ fetch: respond, hostname: "127.0.0.1", port });
process.stdout.write(`Privana UX review: ${server.url}\n`);
