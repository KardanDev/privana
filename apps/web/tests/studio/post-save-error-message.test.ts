import { expect, test } from "bun:test";
import { postSaveErrorMessage } from "../../src/domains/studio/post-save-error-message";

test("save transport failures and empty messages provide Portuguese recovery guidance", () => {
  const expected =
    "Não foi possível confirmar o salvamento. Suas alterações continuam no editor. Tente novamente.";
  expect(postSaveErrorMessage(new TypeError("Failed to fetch"))).toBe(expected);
  // biome-ignore lint/suspicious/useErrorMessage: Exercise an upstream error without usable text.
  expect(postSaveErrorMessage(new Error(" "))).toBe(expected);
});

test("specific file validation and payload-conflict guidance remain intact", () => {
  const file = "Escolha uma imagem JPEG, PNG, WebP ou um vídeo MP4.";
  const conflict =
    "Esta tentativa já foi salva com outros dados. Confira suas publicações e abra o conteúdo salvo para editar.";
  expect(postSaveErrorMessage(new Error(file))).toBe(file);
  expect(postSaveErrorMessage(new Error(conflict))).toBe(conflict);
});
