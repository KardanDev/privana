import { AuthForm } from "@/domains/auth/auth-form";

export const metadata = {
  robots: { index: false },
  title: "Recuperar acesso",
};

export default function ForgotPasswordPage() {
  return <AuthForm mode="forgot" />;
}
