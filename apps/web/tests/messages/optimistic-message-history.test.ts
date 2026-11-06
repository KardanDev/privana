import { expect, test } from "bun:test";
import type {
  ConversationDTO,
  MessageDTO,
} from "@privana/api/contracts/product";
import { appendMessage } from "../../src/domains/messages/append-message";
import { confirmMessage } from "../../src/domains/messages/confirm-message";
import type {
  MessageAttempt,
  MessageHistory,
} from "../../src/domains/messages/message-types";
import { updateConversationPreview } from "../../src/domains/messages/update-conversation-preview";
import { visibleMessageHistory } from "../../src/domains/messages/visible-message-history";

const first: MessageDTO = {
  body: "First",
  createdAt: "2026-11-06T10:00:00Z",
  id: "first",
  senderId: "member",
};
const second: MessageDTO = {
  body: "Incoming",
  createdAt: "2026-11-06T10:01:00Z",
  id: "second",
  senderId: "creator",
};
const attempt: MessageAttempt = {
  body: "Outgoing",
  conversationId: "conversation",
  createdAt: "2026-11-06T10:02:00Z",
  id: "pending-1",
  senderId: "member",
};
const history: MessageHistory = { pageParams: [undefined], pages: [[first]] };

test("pending messages survive a background history refresh and keep distinct identical sends", () => {
  const outbox = [
    { attempt, status: "pending" as const },
    { attempt: { ...attempt, id: "pending-2" }, status: "pending" as const },
  ];
  const visible = visibleMessageHistory([[first, second]], outbox);
  expect(visible.map((message) => message.id)).toEqual([
    "first",
    "second",
    "pending-1",
    "pending-2",
  ]);
  expect(visible.at(-1)?.delivery).toBe("pending");
});

test("acknowledgement replaces the temporary ID once across overlapping pages", () => {
  const confirmed = { ...attempt, id: "server-1" };
  const pending = appendMessage(history, { ...attempt, delivery: "pending" });
  const next = confirmMessage(
    { ...history, pages: [pending?.pages[0] ?? [], [confirmed, first]] },
    attempt.id,
    confirmed
  );
  const visible = visibleMessageHistory(next?.pages ?? [], [
    { attempt, status: "pending" },
  ]);
  expect(visible.map((message) => message.id)).toEqual(["first", "server-1"]);
  expect(visible.at(-1)?.clientId).toBe(attempt.id);
  expect(visible.at(-1)?.delivery).toBeUndefined();
  expect(history.pages[0]).toEqual([first]);
});

test("a failed send stays visible without replacing incoming history", () => {
  const visible = visibleMessageHistory(
    [[first, second]],
    [{ attempt, status: "error" }]
  );
  expect(visible).toHaveLength(3);
  expect(visible[1]).toEqual(second);
  expect(visible[2]?.delivery).toBe("failed");
  expect(visible[2]?.body).toBe("Outgoing");
});

test("polling a confirmed message never duplicates the acknowledgement", () => {
  const confirmed = { ...attempt, id: "server-1" };
  const next = confirmMessage(
    { ...history, pages: [[first, confirmed]] },
    attempt.id,
    confirmed
  );
  expect(visibleMessageHistory(next?.pages ?? [], [])).toHaveLength(2);
});

test("a lost response followed by polling resolves the failed outbox by its stable request ID", () => {
  const requestId = "d0af9549-6323-4f50-81d7-62910a370701";
  const pending = { ...attempt, id: `pending-${requestId}` };
  const server = { ...attempt, id: requestId };
  const visible = visibleMessageHistory(
    [[first, server]],
    [{ attempt: pending, status: "error" }]
  );
  expect(visible.map((message) => message.id)).toEqual([first.id, requestId]);
  expect(visible.at(-1)?.delivery).toBeUndefined();
});

test("conversation preview updates only its conversation and preserves newer server previews", () => {
  const conversations: ConversationDTO[] = [
    {
      id: "other",
      lastMessage: "untouched",
      otherUser: { id: "other-user", image: null, name: "Other" },
      updatedAt: "2026-11-06T10:00:00Z",
    },
    {
      id: "conversation",
      lastMessage: "previous",
      otherUser: { id: "creator", image: null, name: "Creator" },
      updatedAt: "2026-11-06T10:00:00Z",
    },
  ];
  const next = updateConversationPreview(
    conversations,
    attempt.conversationId,
    attempt
  );
  expect(next?.[0]?.lastMessage).toBe(attempt.body);
  expect(next?.[1]).toEqual(conversations[0]);
  const stale = updateConversationPreview(next, attempt.conversationId, first);
  expect(stale?.[0]?.lastMessage).toBe(attempt.body);
  expect(conversations[1]?.lastMessage).toBe("previous");
});
