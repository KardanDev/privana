import assert from "node:assert/strict";
import type { AppRouterClient } from "../../src/routers/index";
import { expectDenied } from "./expect-denied";

export async function verifyMemberFlow(
  member: AppRouterClient,
  creator: AppRouterClient
) {
  const feed = await member.feed.list({ limit: 24 });
  const post = feed.items.find((item) => item.visibility === "PUBLIC");
  assert.ok(post, "Demo feed must contain a public publication");
  const premium = feed.items.find((item) => item.visibility === "SUBSCRIBERS");
  assert.ok(premium?.locked, "Premium publication must remain locked");
  assert.equal(premium.body, null);
  assert.equal(premium.mediaUrl, null);
  await member.posts.setLike({ liked: !post.isLiked, postId: post.id });
  await member.posts.setLike({ liked: post.isLiked, postId: post.id });
  await member.posts.setBookmark({
    bookmarked: !post.isBookmarked,
    postId: post.id,
  });
  await member.posts.setBookmark({
    bookmarked: post.isBookmarked,
    postId: post.id,
  });
  const conversations = await member.messages.list();
  const conversation = conversations.find(
    (item) => item.otherUser.id === "demo-luna-demo"
  );
  assert.ok(conversation, "Demo conversation must exist");
  const history = await member.messages.get({
    conversationId: conversation.id,
  });
  assert.ok(history.length >= 2);
  const message = await member.messages.send({
    body: "DEMONSTRAÇÃO · Mensagem de teste de integração HTTP.",
    conversationId: conversation.id,
  });
  const recipientHistory = await creator.messages.get({
    conversationId: conversation.id,
  });
  assert.ok(recipientHistory.some((item) => item.id === message.id));
  await expectDenied(
    member.studio.savePost({
      body: "Teste",
      excerpt: "",
      status: "DRAFT",
      title: "Teste",
      visibility: "PUBLIC",
    })
  );
}
