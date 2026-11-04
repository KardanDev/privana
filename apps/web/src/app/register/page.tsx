import { AuthForm } from "@/domains/auth/auth-form";

export const metadata = {
  robots: { index: false },
  title: "Criar conta",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
