export interface MediaReadOptions {
  range?: string;
  signal: AbortSignal;
  token: string;
}
export interface PrivateMediaResult {
  blob: { pathname: string; contentType: string; size: number };
  headers: Headers;
  statusCode: number;
  stream: ReadableStream<Uint8Array>;
}
