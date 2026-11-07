export async function requestJson(url, { token, body, fetcher = fetch }) {
  const target = new URL(url);
  const github =
    target.origin === "https://api.github.com" &&
    target.pathname.startsWith("/repos/KardanDev/privana/");
  const linear = target.href === "https://api.linear.app/graphql";
  if (!(github || linear)) {
    throw new Error(
      "Only the configured GitHub repository and Linear GraphQL endpoint are allowed."
    );
  }
  const response = await fetcher(target, {
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      Accept: "application/json",
      Authorization: github ? `Bearer ${token}` : token,
      "Content-Type": "application/json",
      ...(github ? { "X-GitHub-Api-Version": "2022-11-28" } : {}),
    },
    method: body ? "POST" : "GET",
    redirect: "error",
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    throw new Error(
      `${github ? "GitHub" : "Linear"} request failed (${response.status}); credentials and provider bodies are not logged.`
    );
  }
  const result = await response.json();
  if (linear && (result.errors?.length || !result.data)) {
    throw new Error(
      "Linear rejected the GraphQL operation; check key permissions and the API schema. Provider details are not logged."
    );
  }
  return linear ? result.data : result;
}
