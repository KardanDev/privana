import { AuthForm } from "@/domains/auth/auth-form";

export const metadata = { robots: { index: false }, title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <AuthForm
      initialMessage={
        !params.error && params.verified === "1"
          ? "E-mail confirmado. Agora você já pode entrar!"
          : undefined
      }
      invalidLink={Boolean(params.error)}
      mode="login"
    />
  );
}
