import type { MessageDTO } from "@privana/api/contracts/product";

export function mergeMessagePages<T extends MessageDTO>(pages: T[][]): T[] {
  const unique = new Map<string, T>();
  for (const page of pages) {
    for (const message of page) {
      if (!unique.has(message.id)) {
        unique.set(message.id, message);
      }
    }
  }
  return Array.from(unique.values()).toSorted((left, right) => {
    const timeDifference =
      Date.parse(left.createdAt) - Date.parse(right.createdAt);
    if (timeDifference) {
      return timeDifference;
    }
    if (left.id === right.id) {
      return 0;
    }
    return left.id < right.id ? -1 : 1;
  });
}
