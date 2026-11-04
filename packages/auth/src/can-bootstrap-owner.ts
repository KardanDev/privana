export function canBootstrapOwner(
  user: { emailVerified: boolean; status: string } | null
): boolean {
  return user?.emailVerified === true && user.status === "ACTIVE";
}
