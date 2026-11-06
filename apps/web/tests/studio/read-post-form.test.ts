import { expect, test } from "bun:test";
import { readPostForm } from "../../src/domains/studio/read-post-form";

test("create retries preserve the editor's UUID while edits send only the stored post ID", () => {
  const form = new FormData();
  form.set("title", " Title ");
  form.set("body", " Body ");
  form.set("excerpt", " Preview ");
  const attempt = "60e87761-4624-4aee-bd6d-b56ea6c9c76b";
  const created = readPostForm(form, "DRAFT", undefined, attempt);
  expect(readPostForm(form, "DRAFT", undefined, attempt)).toEqual(created);
  expect(created).toMatchObject({
    body: "Body",
    clientPostId: attempt,
    id: undefined,
    title: "Title",
  });
  const edited = readPostForm(form, "PUBLISHED", "stored-post", attempt);
  expect(edited.id).toBe("stored-post");
  expect(edited.clientPostId).toBeUndefined();
});
