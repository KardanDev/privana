export interface CommentAttempt {
  body: string;
  clientCommentId: string;
  postId: string;
}

export function commentAttempt(
  previous: CommentAttempt | null,
  postId: string,
  body: string,
  createId: () => string = () => crypto.randomUUID()
): CommentAttempt {
  const trimmed = body.trim();
  return previous?.body === trimmed && previous.postId === postId
    ? previous
    : { body: trimmed, clientCommentId: createId(), postId };
}
