export function effectiveSubscriptionStatus(
  subscription: { status: string; expiresAt: Date },
  now: Date
): string {
  if (subscription.status === "ACTIVE" && subscription.expiresAt <= now) {
    return "EXPIRED";
  }
  return subscription.status;
}
