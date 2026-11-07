export async function requestGitHub(path, token, fetcher = fetch) {
  const response = await fetcher(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    redirect: "error",
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    throw new Error(
      `GitHub request failed (${response.status}); response bodies and tokens are not logged.`
    );
  }
  return await response.json();
}
