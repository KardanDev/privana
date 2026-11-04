import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Resend } from "resend";
import type { EmailConfig } from "../src/email/config";
import { sendEmail } from "../src/email/send-email";
import { validateEmailConfig } from "../src/email/validate-email-config";

/** Sends only to Resend's documented delivery simulator, never a real inbox. */
export async function checkEmail(config: EmailConfig) {
  if (validateEmailConfig(config) !== "resend") {
    throw new Error(
      "Configure EMAIL_DELIVERY_MODE=resend para testar a entrega."
    );
  }
  const resend = new Resend(config.RESEND_API_KEY);
  let emailId: string | undefined;
  const day = new Date().toISOString().slice(0, 10);
  await sendEmail(
    config,
    {
      html: "<p>Teste de entrega do transporte de e-mail da Privana pelo SDK oficial do Resend.</p><p>Esta mensagem não contém credenciais ou links de acesso.</p>",
      subject: `Privana · teste de entrega · ${day}`,
      text: "Teste de entrega do transporte de e-mail da Privana pelo SDK oficial do Resend. Esta mensagem não contém credenciais ou links de acesso.",
      to: "delivered@resend.dev",
    },
    () => ({
      send: async (payload, options) => {
        const response = await resend.emails.send(payload, options);
        emailId = response.data?.id;
        return response;
      },
    })
  );
  if (!emailId) {
    throw new Error("O Resend não retornou o identificador do teste.");
  }
  const receipt = await resend.emails.get(emailId);
  return {
    accepted: true,
    emailId,
    lastEvent: receipt.data?.last_event ?? null,
    recipient: "delivered@resend.dev",
    statusReadError: receipt.error?.name ?? null,
  };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    process.stdout.write(`${JSON.stringify(await checkEmail(process.env))}\n`);
  } catch (error) {
    process.stderr.write(
      `${error instanceof Error ? error.message : "Não foi possível testar a entrega pelo Resend."}\n`
    );
    process.exitCode = 1;
  }
}
