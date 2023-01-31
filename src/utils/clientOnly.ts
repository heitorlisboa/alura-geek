export function clientOnly<T>(value: T) {
  return typeof window === undefined ? undefined : value;
}
