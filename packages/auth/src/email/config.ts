export interface EmailConfig {
  EMAIL_DELIVERY_MODE?: string;
  EMAIL_FROM?: string;
  EMAIL_PREVIEW_DIRECTORY?: string;
  NODE_ENV?: string;
  RESEND_API_KEY?: string;
}

export interface EmailMessage {
  html: string;
  subject: string;
  text: string;
  to: string;
}
