import { expect, test } from "bun:test";
import { hasUnsavedPostChanges } from "../../src/domains/studio/has-unsaved-post-changes";
import { post } from "../posts/social-fixtures";

for (const existing of [undefined, post]) {
  test(`${existing ? "edit" : "new"}: meaningful fields and file selection determine dirty work`, () => {
    const values = {
      body: existing?.body ?? "",
      excerpt: existing?.excerpt ?? "",
      previewUrl: existing?.previewUrl ?? "",
      title: existing?.title ?? "",
      visibility: "PUBLIC",
    };
    const data = new FormData();
    for (const [field, value] of Object.entries(values)) {
      data.set(field, value);
    }
    expect(hasUnsavedPostChanges(data, existing)).toBe(false);
    for (const [field, value] of Object.entries(values)) {
      data.set(field, field === "visibility" ? "SUBSCRIBERS" : "Alteração");
      expect(hasUnsavedPostChanges(data, existing)).toBe(true);
      data.set(field, value);
    }
    data.set("title", ` ${values.title} `);
    data.set("body", `${values.body}\n`);
    data.set("media", new File([], ""));
    expect(hasUnsavedPostChanges(data, existing)).toBe(false);
    data.set("media", new File([], "vazio.png"));
    expect(hasUnsavedPostChanges(data, existing)).toBe(true);
    data.set(
      "media",
      new File(["fixture"], "rascunho.pdf", { type: "application/pdf" })
    );
    expect(hasUnsavedPostChanges(data, existing)).toBe(true);
    data.delete("media");
    expect(hasUnsavedPostChanges(data, existing)).toBe(false);
  });
}
