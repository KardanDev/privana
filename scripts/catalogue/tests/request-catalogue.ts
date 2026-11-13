import type { IncomingHttpHeaders } from "node:http";
import { request } from "node:http";

export async function requestCatalogue(
  port: number,
  path: string,
  headers: Record<string, string> = {},
  method = "GET"
) {
  return await new Promise<{
    status: number | undefined;
    headers: IncomingHttpHeaders;
    body: string;
  }>((resolve, reject) => {
    const req = request(
      {
        headers: { Host: "127.0.0.1:53471", ...headers },
        hostname: "127.0.0.1",
        method,
        path,
        port,
      },
      (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk: string) => {
          body += chunk;
        });
        response.on("end", () =>
          resolve({
            body,
            headers: response.headers,
            status: response.statusCode,
          })
        );
      }
    );
    req.on("error", reject);
    req.end();
  });
}
