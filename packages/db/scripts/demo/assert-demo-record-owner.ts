export function assertDemoRecordOwner(
  record: object | null,
  expected: Record<string, string | boolean>
): void {
  if (
    record &&
    Object.entries(expected).some(
      ([key, value]) => Reflect.get(record, key) !== value
    )
  ) {
    throw new Error(
      "Um identificador de demonstração pertence a outro registro. Operação cancelada."
    );
  }
}
