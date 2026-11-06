import { expect, test } from "bun:test";
import { readBrowserTarget } from "./support/read-browser-target";

test("browser smoke requires explicit opt-in and target", () => {
  expect(() => readBrowserTarget({})).toThrow();
  expect(() => readBrowserTarget({ ALLOW_BROWSER_SMOKE: "1" })).toThrow();
  expect(() =>
    readBrowserTarget({ BROWSER_SMOKE_ORIGIN: "http://localhost:3001" })
  ).toThrow();
});

test.each([
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "http://[::1]:3001",
])("browser smoke permits explicit loopback origin %s", (origin) => {
  expect(
    readBrowserTarget({
      ALLOW_BROWSER_SMOKE: "1",
      BROWSER_SMOKE_ORIGIN: origin,
    })
  ).toBe(origin);
});

test.each([
  "https://privana.example:3001",
  "http://localhost.evil.example:3001",
  "http://127.0.0.2:3001",
  "http://localhost",
  "http://user:secret@localhost:3001",
  "http://localhost:3001/checkout/demo",
  "http://localhost:3001?token=secret",
  "http://localhost:3001#fragment",
  "ftp://localhost:3001",
])("browser smoke rejects unsafe target %s", (origin) => {
  expect(() =>
    readBrowserTarget({
      ALLOW_BROWSER_SMOKE: "1",
      BROWSER_SMOKE_ORIGIN: origin,
    })
  ).toThrow();
});

test.each([{ NODE_ENV: "production" }, { VERCEL_ENV: "production" }])(
  "browser smoke rejects a production process",
  (environment) => {
    expect(() =>
      readBrowserTarget({
        ...environment,
        ALLOW_BROWSER_SMOKE: "1",
        BROWSER_SMOKE_ORIGIN: "http://localhost:3001",
      })
    ).toThrow();
  }
);
