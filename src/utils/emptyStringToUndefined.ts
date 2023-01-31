export function emptyStringToUndefined(value: unknown) {
  return value === "" ? undefined : value;
}
