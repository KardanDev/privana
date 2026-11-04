import { AuthForm } from "@/domains/auth/auth-form";

export const metadata = {
  robots: { index: false },
  title: "Confirmar e-mail",
};

export default function VerifyEmailPage() {
  return <AuthForm mode="verify" />;
}
