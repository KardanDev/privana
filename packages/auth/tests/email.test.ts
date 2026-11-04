import { expect, test } from "bun:test";
import { mkdtemp, readdir, readFile, rmdir, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { canBootstrapOwner } from "../src/can-bootstrap-owner";
import type { EmailProviderFactory } from "../src/email/email-provider";
import { renderAuthEmail } from "../src/email/render-auth-email";
import { sendEmail } from "../src/email/send-email";
import { validateEmailConfig } from "../src/email/validate-email-config";

const message = {
  html: "<p>Teste local</p>",
  subject: "Privana",
  text: "Teste local",
  to: "delivered@resend.dev",
};

test("production runtime rejects preview even when configuration claims development", async () => {
  const directory = await mkdtemp(join(tmpdir(), "privana-mail-runtime-test-"));
  const previousEnvironment = process.env.NODE_ENV;
  let requests = 0;
  const request: EmailProviderFactory = () => {
    requests += 1;
    return {
      send: () =>
        Promise.resolve({
          data: { id: "test-id" },
          error: null,
          headers: null,
        }),
    };
  };
  try {
    process.env.NODE_ENV = "production";
    await expect(
      sendEmail(
        {
          EMAIL_DELIVERY_MODE: "preview",
          EMAIL_PREVIEW_DIRECTORY: directory,
          NODE_ENV: "development",
        },
        message,
        request
      )
    ).rejects.toThrow("preview");
    expect(await readdir(directory)).toHaveLength(0);
    expect(requests).toBe(0);
  } finally {
    if (previousEnvironment === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = previousEnvironment;
    }
    const files = await readdir(directory);
    await Promise.all(files.map((file) => unlink(join(directory, file))));
    await rmdir(directory);
  }
});

test("explicit development preview saves HTML locally without contacting the provider", async () => {
  const directory = await mkdtemp(join(tmpdir(), "privana-mail-test-"));
  try {
    await sendEmail(
      {
        EMAIL_DELIVERY_MODE: "preview",
        EMAIL_PREVIEW_DIRECTORY: directory,
        NODE_ENV: "test",
      },
      message
    );
    const files = await readdir(directory);
    expect(files).toHaveLength(1);
    const [file] = files;
    if (!file) {
      throw new Error("Preview file was not created.");
    }
    expect(await readFile(join(directory, file), "utf8")).toBe(message.html);
    await unlink(join(directory, file));
  } finally {
    await rmdir(directory);
  }
});

test("transport does not make a network request when production config is invalid", async () => {
  let requests = 0;
  const request: EmailProviderFactory = () => {
    requests += 1;
    return {
      send: () =>
        Promise.resolve({
          data: { id: "test-id" },
          error: null,
          headers: null,
        }),
    };
  };
  await expect(
    sendEmail(
      { EMAIL_DELIVERY_MODE: "preview", NODE_ENV: "production" },
      message,
      request
    )
  ).rejects.toThrow("preview");
  expect(requests).toBe(0);
});

test("transport reports provider failure and uses a deterministic idempotency key", async () => {
  const keys: string[] = [];
  const request: EmailProviderFactory = () => ({
    send: (_payload, options) => {
      keys.push(options?.idempotencyKey ?? "");
      return Promise.resolve({
        data: null,
        error: {
          message: "Temporary error",
          name: "internal_server_error",
          statusCode: 503,
        },
        headers: null,
      });
    },
  });
  const config = {
    EMAIL_DELIVERY_MODE: "resend",
    EMAIL_FROM: "Privana <account@example.test>",
    NODE_ENV: "production",
    RESEND_API_KEY: "test-only-key",
  };
  await expect(sendEmail(config, message, request)).rejects.toThrow("Resend");
  await expect(sendEmail(config, message, request)).rejects.toThrow("Resend");
  expect(keys[0]).toBe(keys[1]);
  expect(keys[0]).toStartWith("auth/");
});

test("email templates escape names and links and reject executable links", () => {
  const result = renderAuthEmail({
    kind: "verify",
    name: '<script>"&',
    url: "https://privana.example/verify?a=1&b=2",
  });
  expect(result.html).not.toContain("<script>");
  expect(result.html).toContain("&lt;script&gt;&quot;&amp;");
  expect(result.html).toContain("a=1&amp;b=2");
  expect(() =>
    renderAuthEmail({ kind: "reset", name: "Ana", url: "javascript:alert(1)" })
  ).toThrow();
});

test("production rejects preview and incomplete Resend configuration", () => {
  expect(() =>
    validateEmailConfig({
      EMAIL_DELIVERY_MODE: "preview",
      NODE_ENV: "production",
    })
  ).toThrow("preview");
  expect(() => validateEmailConfig({ NODE_ENV: "production" })).toThrow(
    "EMAIL_DELIVERY_MODE"
  );
  expect(() =>
    validateEmailConfig({
      EMAIL_DELIVERY_MODE: "resend",
      NODE_ENV: "production",
    })
  ).toThrow("RESEND_API_KEY");
  expect(
    validateEmailConfig({
      EMAIL_DELIVERY_MODE: "preview",
      NODE_ENV: "development",
    })
  ).toBe("preview");
});

test("owner bootstrap requires an existing verified active account", () => {
  expect(canBootstrapOwner(null)).toBe(false);
  expect(canBootstrapOwner({ emailVerified: false, status: "ACTIVE" })).toBe(
    false
  );
  expect(canBootstrapOwner({ emailVerified: true, status: "SUSPENDED" })).toBe(
    false
  );
  expect(canBootstrapOwner({ emailVerified: true, status: "ACTIVE" })).toBe(
    true
  );
});
