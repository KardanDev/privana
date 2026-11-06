import { isPrivateHost } from "./is-private-host";
import type { SyncTarget } from "./sync-types";
export function validateSyncEndpoint(
  key: string,
  value: string,
  target: SyncTarget
): void {
  if (!URL.canParse(value)) {
    throw new Error(`${key} must be a valid connection URL.`);
  }
  const url = new URL(value);
  const database = key === "DATABASE_URL";
  const validProtocol = database
    ? ["postgres:", "postgresql:"].includes(url.protocol)
    : url.protocol === "https:";
  if (!(validProtocol && url.hostname) || url.hash) {
    throw new Error(`${key} uses an unsupported connection format.`);
  }
  if (target === "development") {
    return;
  }
  if (isPrivateHost(url.hostname)) {
    throw new Error(`${key} must use an approved hosted endpoint.`);
  }
  if (
    database &&
    !["require", "verify-ca", "verify-full"].includes(
      url.searchParams.get("sslmode") ?? ""
    )
  ) {
    throw new Error(`${key} must preserve the provider's TLS configuration.`);
  }
  if (!database && (url.username || url.password)) {
    throw new Error(`${key} must not embed credentials in its URL.`);
  }
}
