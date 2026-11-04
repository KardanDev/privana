"use client";

import { type MouseEvent, useCallback, useRef, useState } from "react";

export function useCmsRows(
  initial: Record<string, string>[],
  maximum: number,
  onEdit: () => void
) {
  const [rows, setRows] = useState(() =>
    initial.map((values, index) => ({ id: `row-${index}`, values }))
  );
  const nextId = useRef(initial.length);
  const add = useCallback(() => {
    const id = `row-${nextId.current}`;
    nextId.current += 1;
    setRows((current) =>
      current.length < maximum ? [...current, { id, values: {} }] : current
    );
    onEdit();
  }, [maximum, onEdit]);
  const remove = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const id = event.currentTarget.value;
      setRows((current) => current.filter((row) => row.id !== id));
      onEdit();
    },
    [onEdit]
  );
  return { add, remove, rows };
}
