import { expect, test } from "bun:test";
import { requireDemoSmokeEnvironment } from "../scripts/smoke/require-demo-smoke-environment";

test.each([
  {},
  { ALLOW_DEMO_SMOKE: "1" },
  { ALLOW_DEMO_SMOKE: "1", NODE_ENV: "production" },
  { ALLOW_DEMO_SMOKE: "1", NODE_ENV: "development", VERCEL_ENV: "production" },
  { ALLOW_DEMO_SMOKE: "0", NODE_ENV: "development" },
])(
  "demo writes refuse missing opt-in, unidentified environments and production: %j",
  (env) => {
    expect(() => requireDemoSmokeEnvironment(env)).toThrow(
      "Demo HTTP smoke requires"
    );
  }
);

test.each(["development", "test"])(
  "explicit nonproduction %s allows a deliberate demo check",
  (nodeEnv) => {
    expect(() =>
      requireDemoSmokeEnvironment({ ALLOW_DEMO_SMOKE: "1", NODE_ENV: nodeEnv })
    ).not.toThrow();
  }
);
