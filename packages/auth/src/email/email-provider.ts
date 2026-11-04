import type { Resend } from "resend";

export type EmailProvider = Pick<Resend["emails"], "send">;
export type EmailProviderFactory = (apiKey: string) => EmailProvider;
