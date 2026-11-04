import type { MessageDTO } from "@privana/api/contracts/product";

export function mergeMessagePages(pages: MessageDTO[][]): MessageDTO[] {
  const unique = new Map<string, MessageDTO>();
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
