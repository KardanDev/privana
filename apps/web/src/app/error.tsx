"use client";
import { QueryFeedback } from "@/shared/components/query-feedback";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <QueryFeedback retry={reset} />;
}
