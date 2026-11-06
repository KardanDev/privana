import { expect, test } from "bun:test";
import { call } from "@orpc/server";
import { sendMessage } from "../src/domains/messages/send";
import { messageIdempotencyFixture } from "./message-idempotency-fixture";

const clientMessageId = "53fb0788-1e10-4720-ac96-0a71709b62ad";
const input = { body: "Hello", clientMessageId, conversationId: "shared" };

test("concurrent retries return one message and create only one inbox update and notification", async () => {
  const fixture = messageIdempotencyFixture();
  const responses = await Promise.all(
    Array.from(
      { length: 20 },
      async () => await call(sendMessage, input, { context: fixture.context() })
    )
  );
  expect(new Set(responses.map((response) => response.id))).toEqual(
    new Set([clientMessageId])
  );
  expect(responses.every((response) => response.body === input.body)).toBe(
    true
  );
  expect(fixture.rows.size).toBe(1);
  expect(fixture.notify).toHaveBeenCalledTimes(1);
  expect(fixture.updateConversation).toHaveBeenCalledTimes(1);
  expect(fixture.createMany).toHaveBeenCalledWith({
    data: [
      {
        body: "Hello",
        conversationId: "shared",
        id: clientMessageId,
        senderId: "alice",
      },
    ],
    skipDuplicates: true,
  });
});

test("a retried key is normalized and a trimmed equivalent body returns the original timestamp", async () => {
  const fixture = messageIdempotencyFixture();
  const first = await call(sendMessage, input, { context: fixture.context() });
  const retry = await call(
    sendMessage,
    {
      ...input,
      body: " Hello ",
      clientMessageId: clientMessageId.toUpperCase(),
    },
    { context: fixture.context() }
  );
  expect(retry).toEqual(first);
  expect(fixture.notify).toHaveBeenCalledTimes(1);
});

test.each([
  { body: "Different content", conversationId: "shared", viewer: "alice" },
  { body: "Hello", conversationId: "other-authorized", viewer: "alice" },
  { body: "Hello", conversationId: "shared", viewer: "bob" },
])(
  "reusing a key for another body, conversation or sender is rejected: %j",
  async (reuse) => {
    const fixture = messageIdempotencyFixture();
    await call(sendMessage, input, { context: fixture.context() });
    await expect(
      call(
        sendMessage,
        { ...input, body: reuse.body, conversationId: reuse.conversationId },
        { context: fixture.context(reuse.viewer) }
      )
    ).rejects.toMatchObject({ code: "CONFLICT" });
    expect(fixture.rows.size).toBe(1);
    expect(fixture.notify).toHaveBeenCalledTimes(1);
    expect(fixture.updateConversation).toHaveBeenCalledTimes(1);
  }
);

test("known message IDs do not bypass current membership or participant account checks", async () => {
  const fixture = messageIdempotencyFixture();
  await call(sendMessage, input, { context: fixture.context() });
  const reads = fixture.findUnique.mock.calls.length;
  await expect(
    call(sendMessage, input, { context: fixture.context("outsider") })
  ).rejects.toMatchObject({ code: "FORBIDDEN" });
  fixture.state.recipientActive = false;
  await expect(
    call(sendMessage, input, { context: fixture.context() })
  ).rejects.toMatchObject({ code: "FORBIDDEN" });
  fixture.state.recipientActive = true;
  fixture.state.senderActive = false;
  await expect(
    call(sendMessage, input, { context: fixture.context() })
  ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  expect(fixture.findUnique).toHaveBeenCalledTimes(reads);
  expect(fixture.notify).toHaveBeenCalledTimes(1);
});

test("disabling messaging blocks retries before looking up the existing message", async () => {
  const fixture = messageIdempotencyFixture();
  await call(sendMessage, input, { context: fixture.context() });
  fixture.state.messaging = false;
  await expect(
    call(sendMessage, input, { context: fixture.context() })
  ).rejects.toMatchObject({ code: "FORBIDDEN" });
  expect(fixture.transaction).toHaveBeenCalledTimes(1);
  expect(fixture.findUnique).toHaveBeenCalledTimes(1);
});

test("clients without idempotency IDs retain server-generated messages", async () => {
  const fixture = messageIdempotencyFixture();
  const first = await call(
    sendMessage,
    { body: "Hello", conversationId: "shared" },
    { context: fixture.context() }
  );
  const second = await call(
    sendMessage,
    { body: "Hello", conversationId: "shared" },
    { context: fixture.context() }
  );
  expect(first.id).not.toBe(second.id);
  expect(fixture.createMany).not.toHaveBeenCalled();
  expect(fixture.notify).toHaveBeenCalledTimes(2);
});

test("invalid client IDs fail validation without entering a transaction", async () => {
  const fixture = messageIdempotencyFixture();
  await expect(
    call(
      sendMessage,
      { ...input, clientMessageId: "not-a-uuid" },
      { context: fixture.context() }
    )
  ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  expect(fixture.transaction).not.toHaveBeenCalled();
});
