type DemoRow = Record<string, unknown>;

const REFERENCES: Record<string, Record<string, string>> = {
  account: { userId: "user" },
  auditEvent: { actorId: "user" },
  bookmark: { postId: "post", userId: "user" },
  comment: { postId: "post", userId: "user" },
  conversation: { participantAId: "user", participantBId: "user" },
  creatorProfile: { userId: "user" },
  follow: { creatorId: "creatorProfile", userId: "user" },
  like: { postId: "post", userId: "user" },
  membershipInterest: { creatorId: "creatorProfile", userId: "user" },
  message: { conversationId: "conversation", senderId: "user" },
  notification: { userId: "user" },
  post: { creatorId: "creatorProfile" },
  report: { creatorId: "creatorProfile", postId: "post", reporterId: "user" },
};

export function assertDemoFixtureRelations(
  tables: Map<string, Map<string, DemoRow>>,
  model: string,
  row: DemoRow
): void {
  for (const [field, target] of Object.entries(REFERENCES[model] ?? {})) {
    const value = row[field];
    if (value === undefined || value === null) {
      continue;
    }
    if (typeof value !== "string" || !tables.get(target)?.has(value)) {
      throw new Error(
        `Foreign key violation: ${model}.${field} references missing ${target}`
      );
    }
  }
}
