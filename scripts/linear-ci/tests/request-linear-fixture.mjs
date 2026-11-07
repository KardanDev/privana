export function requestLinearFixture(state, query, variables) {
  if (query.includes("mutation")) {
    state.writes.push(variables.input);
    if (state.mutationSuccess) {
      state.issue.comments.nodes.push({
        body: variables.input.body,
        id: variables.input.id,
      });
    }
    return Promise.resolve({
      commentCreate: {
        comment: state.mutationSuccess ? { id: variables.input.id } : null,
        success: state.mutationSuccess,
      },
    });
  }
  const value = structuredClone(state.issue);
  if (state.commentPages) {
    value.comments = state.commentPages[variables.after ?? "first"];
  }
  return Promise.resolve({ issue: value });
}
