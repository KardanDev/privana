import { linearProject, linearTeam } from "./config.mjs";
import { createCommentId } from "./create-comment-id.mjs";

const issueQuery = `query CiIssue($id: String!, $after: String) {
  issue(id: $id) {
    id identifier archivedAt project { id } team { id }
    children(first: 1) { nodes { id } }
    comments(first: 100, after: $after) {
      nodes { id body }
      pageInfo { hasNextPage endCursor }
    }
  }
}`;
const createMutation = `mutation CiComment($input: CommentCreateInput!) {
  commentCreate(input: $input) { success comment { id } }
}`;

export async function publishComment({
  issueId,
  comment,
  requestLinear,
  confirm,
}) {
  let after = null;
  let issue;
  const cursors = new Set();
  for (let page = 0; page < 100; page += 1) {
    const data = await requestLinear(issueQuery, { after, id: issueId });
    issue = data.issue;
    if (
      !(
        issue &&
        issue.identifier === issueId &&
        !issue.archivedAt &&
        issue.project?.id === linearProject &&
        issue.team?.id === linearTeam &&
        issue.children?.nodes.length === 0
      )
    ) {
      throw new Error(
        "The primary issue must be an unarchived actionable Privana issue in the configured project and team."
      );
    }
    const commentId = createCommentId(`${issue.id}:${comment.marker}`);
    if (
      issue.comments.nodes.some(
        (item) => item.id === commentId || item.body?.includes(comment.marker)
      )
    ) {
      return "already-reported";
    }
    const info = issue.comments.pageInfo;
    if (!info.hasNextPage) {
      if (!(await confirm())) {
        return "stale";
      }
      const created = await requestLinear(createMutation, {
        input: {
          body: comment.body,
          doNotSubscribeToIssue: true,
          id: commentId,
          issueId: issue.id,
        },
      });
      if (
        !(created.commentCreate?.success && created.commentCreate.comment?.id)
      ) {
        throw new Error("Linear did not confirm comment creation.");
      }
      return "reported";
    }
    if (!info.endCursor || cursors.has(info.endCursor)) {
      throw new Error(
        "Linear pagination did not advance; no comment was created."
      );
    }
    after = info.endCursor;
    cursors.add(after);
  }
  throw new Error(
    "Linear comment pagination exceeded its safety limit; no comment was created."
  );
}
