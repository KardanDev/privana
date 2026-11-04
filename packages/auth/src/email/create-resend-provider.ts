import { Resend } from "resend";
import type { EmailProvider } from "./email-provider";

export function createResendProvider(apiKey: string): EmailProvider {
  return new Resend(apiKey, { baseUrl: "https://api.resend.com" }).emails;
}
