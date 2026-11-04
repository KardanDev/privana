export const MEDIA_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
} as const;

export type MediaType = keyof typeof MEDIA_EXTENSIONS;
export const MAX_MEDIA_BYTES = 100 * 1024 * 1024;
export const MAX_MEDIA_JSON_BYTES = 16 * 1024;
export const MEDIA_RESPONSE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  Vary: "Cookie",
  "X-Content-Type-Options": "nosniff",
} as const;
