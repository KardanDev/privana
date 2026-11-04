import type { DemoAccountDefinition } from "./definitions";
export function isOwnedDemoUser(
  user: {
    id: string;
    email: string;
    name: string;
    creatorProfile?: { isDemo: boolean } | null;
    hasManagedCredential?: boolean;
  },
  definition: DemoAccountDefinition
): boolean {
  return (
    user.id === definition.userId &&
    user.email === definition.email &&
    (user.name.includes("demonstração") ||
      user.creatorProfile?.isDemo === true ||
      user.hasManagedCredential === true)
  );
}
