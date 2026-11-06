import type { CommentDTO, PageDTO } from "@privana/api/contracts/product";
import type { InfiniteData } from "@tanstack/react-query";

export function appendConfirmedComment(
  data: InfiniteData<PageDTO<CommentDTO>> | undefined,
  comment: CommentDTO
): InfiniteData<PageDTO<CommentDTO>> {
  if (!data || data.pages.length === 0) {
    return {
      pageParams: [undefined],
      pages: [{ items: [comment], nextCursor: null }],
    };
  }
  if (
    data.pages.some((page) => page.items.some((item) => item.id === comment.id))
  ) {
    return data;
  }
  return {
    ...data,
    pages: data.pages.map((page, index) =>
      index === data.pages.length - 1
        ? { ...page, items: [...page.items, comment] }
        : page
    ),
  };
}
