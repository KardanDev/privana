import { ORPCError } from "@orpc/server";

const CONTENT_RANGE = /^bytes (\d+)-(\d+)\/(\d+)$/;

export function partialMediaLength(
  value: string | null,
  totalSize: number
): number {
  const match = value?.match(CONTENT_RANGE);
  const start = Number(match?.[1]);
  const end = Number(match?.[2]);
  const total = Number(match?.[3]);
  if (
    !(match && Number.isSafeInteger(start) && Number.isSafeInteger(end)) ||
    start < 0 ||
    end < start ||
    end >= total ||
    total !== totalSize
  ) {
    throw new ORPCError("BAD_GATEWAY");
  }
  return end - start + 1;
}
