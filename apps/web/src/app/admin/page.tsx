import type { Metadata } from "next";
import { AdminScreen } from "@/domains/admin/admin-screen";
import { requireOperator } from "@/domains/admin/require-operator";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Administração",
};

export default async function AdminPage() {
  const operator = await requireOperator();
  return (
    <AdminScreen
      viewerId={operator.id}
      viewerName={operator.name}
      viewerRole={operator.role}
    />
  );
}
