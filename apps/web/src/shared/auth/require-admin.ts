import "server-only";
import { notFound } from "next/navigation";
import { requireMember } from "./require-member";
export async function requireAdmin() {
  const member = await requireMember();
  if (member.role !== "admin") {
    notFound();
  }
  return member;
}
