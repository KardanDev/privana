import { CheckoutDemo } from "@/domains/memberships/payment-demo/checkout-demo";

export default async function Page({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  return <CheckoutDemo handle={handle} />;
}
