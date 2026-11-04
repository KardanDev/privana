import { AuthForm } from "@/domains/auth/auth-form";

export const metadata = {
  referrer: "no-referrer",
  robots: { index: false },
  title: "Nova senha",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <AuthForm
      invalidLink={!params.token || Boolean(params.error)}
      mode="reset"
      token={params.token}
    />
  );
}
