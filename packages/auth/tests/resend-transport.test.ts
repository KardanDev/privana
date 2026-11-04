import { expect, spyOn, test } from "bun:test";
import type { EmailProviderFactory } from "../src/email/email-provider";
import { sendEmail } from "../src/email/send-email";

const config = {
  EMAIL_DELIVERY_MODE: "resend",
  EMAIL_FROM: "Comunidade <conta@example.test>",
  NODE_ENV: "test",
  RESEND_API_KEY: "local-test-key",
};
const message = {
  html: "<p>Mensagem de teste sem token</p>",
  subject: "Comunidade",
  text: "Mensagem de teste",
  to: "delivered@resend.dev",
};

test("default transport executes the official SDK against the Resend endpoint with network mocked", async () => {
  const request = spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(JSON.stringify({ id: "sdk-test-id" }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  );
  try {
    await sendEmail(config, message);
    expect(request).toHaveBeenCalledTimes(1);
    const [call] = request.mock.calls;
    if (!call) {
      throw new Error("SDK request was not made");
    }
    const [url, init] = call;
    expect(url).toBe("https://api.resend.com/emails");
    expect(new Headers(init?.headers).get("Authorization")).toBe(
      `Bearer ${config.RESEND_API_KEY}`
    );
    expect(new Headers(init?.headers).get("User-Agent")).toStartWith(
      "resend-node:"
    );
    expect(new Headers(init?.headers).get("Idempotency-Key")).toStartWith(
      "auth/"
    );
    expect(JSON.parse(String(init?.body))).toMatchObject({
      ...message,
      from: config.EMAIL_FROM,
      to: [message.to],
    });
  } finally {
    request.mockRestore();
  }
});

test("official SDK provider receives the complete branded payload and stable idempotency", async () => {
  const keys: string[] = [];
  const provider: EmailProviderFactory = (apiKey) => ({
    send: (payload, options) => {
      expect(apiKey).toBe(config.RESEND_API_KEY);
      expect(payload).toMatchObject({
        ...message,
        from: config.EMAIL_FROM,
        to: [message.to],
      });
      keys.push(options?.idempotencyKey ?? "");
      expect(options?.signal).toBeInstanceOf(AbortSignal);
      return Promise.resolve({
        data: { id: "email-test-id" },
        error: null,
        headers: null,
      });
    },
  });
  await sendEmail(config, message, provider);
  await sendEmail(config, message, provider);
  expect(keys[0]).toBe(keys[1]);
  expect(keys[0]).toStartWith("auth/");
});

test("SDK returned errors become actionable failures without echoing provider content", async () => {
  const provider: EmailProviderFactory = () => ({
    send: () =>
      Promise.resolve({
        data: null,
        error: {
          message: "secret-token-that-must-not-be-repeated",
          name: "invalid_api_key",
          statusCode: 401,
        },
        headers: null,
      }),
  });
  await expect(sendEmail(config, message, provider)).rejects.toThrow(
    "RESEND_API_KEY"
  );
  await expect(sendEmail(config, message, provider)).rejects.toMatchObject({
    status: "SERVICE_UNAVAILABLE",
  });
  await expect(sendEmail(config, message, provider)).rejects.not.toThrow(
    "secret-token-that-must-not-be-repeated"
  );
});

test("Resend rate limit returns an actionable retry message", async () => {
  const provider: EmailProviderFactory = () => ({
    send: () =>
      Promise.resolve({
        data: null,
        error: {
          message: "Rate limit",
          name: "rate_limit_exceeded",
          statusCode: 429,
        },
        headers: null,
      }),
  });
  await expect(sendEmail(config, message, provider)).rejects.toThrow("limite");
});

test("Resend domain rejection explains the verified sender requirement", async () => {
  const provider: EmailProviderFactory = () => ({
    send: () =>
      Promise.resolve({
        data: null,
        error: {
          message: "Provider rejection",
          name: "validation_error",
          statusCode: 403,
        },
        headers: null,
      }),
  });
  await expect(sendEmail(config, message, provider)).rejects.toThrow(
    "EMAIL_FROM"
  );
});

test("SDK success without an email identifier cannot silently claim delivery", async () => {
  const provider: EmailProviderFactory = () => ({
    send: () =>
      Promise.resolve({ data: { id: "" }, error: null, headers: null }),
  });
  await expect(sendEmail(config, message, provider)).rejects.toThrow(
    "confirmou"
  );
});

test("SDK connection failures do not expose thrown request content", async () => {
  const provider: EmailProviderFactory = () => ({
    send: () => Promise.reject(new Error("secret request content")),
  });
  await expect(sendEmail(config, message, provider)).rejects.toThrow("Resend");
  await expect(sendEmail(config, message, provider)).rejects.not.toThrow(
    "secret request content"
  );
});
