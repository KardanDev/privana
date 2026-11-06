import { type FullConfig, request } from "@playwright/test";

export default async function waitForLocalApp(
  config: FullConfig
): Promise<void> {
  const baseURL = config.projects[0]?.use.baseURL;
  if (!baseURL) {
    throw new Error("The anonymous smoke requires its validated local origin.");
  }
  const client = await request.newContext({ baseURL });
  try {
    const response = await client.get("/checkout/demo", {
      maxRedirects: 0,
      timeout: 45_000,
    });
    if (response.status() !== 200) {
      throw new Error(
        "Start the local app with reachable test resources before running browser smoke."
      );
    }
  } finally {
    await client.dispose();
  }
}
