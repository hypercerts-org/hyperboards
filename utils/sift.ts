export const sift = <T>(arr: readonly T[]) =>
  arr.filter(Boolean) as NonNullable<T>[];
