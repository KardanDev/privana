import "server-only";
import { notFound } from "next/navigation";
import { requireMember } from "@/shared/auth/require-member";

export async function requireOperator() {
  const member = await requireMember();
  if (!["admin", "editor", "moderator", "analyst"].includes(member.role)) {
    notFound();
  }
  return member;
}
