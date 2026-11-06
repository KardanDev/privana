// Reviewed deploy inputs. Schema declaration does not authorize internal values.
export const DEPLOYMENT_KEYS = [
  "BETTER_AUTH_SECRET",
  "DATABASE_URL",
  "EMAIL_DELIVERY_MODE",
  "EMAIL_FROM",
  "RESEND_API_KEY",
  "UPSTASH_BLOB_TOKEN",
  "UPSTASH_REDIS_REST_TOKEN",
  "UPSTASH_REDIS_REST_URL",
] as const;
