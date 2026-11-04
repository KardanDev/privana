import assert from "node:assert/strict";

export async function expectDenied(
  action: Promise<unknown>,
  code = "FORBIDDEN"
) {
  await assert.rejects(
    action,
    (error: unknown) =>
      error instanceof Error && "code" in error && error.code === code
  );
}
