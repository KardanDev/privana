export const reportCreatorSelect = {
  bio: true,
  category: true,
  displayName: true,
  handle: true,
  id: true,
  location: true,
  status: true,
  user: { select: { status: true } },
  userId: true,
} as const;
