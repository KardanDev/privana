import { expect, test } from "bun:test";
import { updateMessageDraft } from "../../src/domains/messages/update-message-draft";

test("conversation updates retain independent drafts and preserve UTF-8 text", () => {
  const first = updateMessageDraft({}, "a", "Olá, amanhã! 💜");
  const both = updateMessageDraft(first, "b", "Só para B");
  expect(both).toEqual({ a: "Olá, amanhã! 💜", b: "Só para B" });
  expect(first).toEqual({ a: "Olá, amanhã! 💜" });
  expect(updateMessageDraft(both, "a", "")).toEqual({ a: "", b: "Só para B" });
});

test("late failure updates its current originating draft and preserves newer typing", () => {
  const restore = (draft: string) => (draft.trim() ? draft : "Envio anterior");
  const waiting = { a: "", b: "Outro rascunho" };
  expect(updateMessageDraft(waiting, "a", restore)).toEqual({
    a: "Envio anterior",
    b: "Outro rascunho",
  });
  const newer = updateMessageDraft(waiting, "a", "Nova ideia");
  expect(updateMessageDraft(newer, "a", restore)).toBe(newer);
});
