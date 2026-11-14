import { createServer } from "node:http";
import { buildCatalogue } from "./build-catalogue";
import { catalogueOrigin } from "./catalogue-assets";
import { handleCatalogueRequest } from "./handle-catalogue-request";

try {
  const assets = await buildCatalogue();
  const server = createServer((request, response) =>
    handleCatalogueRequest(assets, request, response)
  );
  server.on("error", (error) => {
    process.stderr.write(`Catalogue failed: ${error.message}\n`);
    process.exitCode = 1;
  });
  server.listen(53_471, "127.0.0.1", () =>
    process.stdout.write(`Privana components: ${catalogueOrigin}\n`)
  );
  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.once(signal, () => server.close(() => process.exit(0)));
  }
} catch (error) {
  process.stderr.write(
    `${error instanceof Error ? error.message : "Catalogue build failed"}\n`
  );
  process.exitCode = 1;
}
