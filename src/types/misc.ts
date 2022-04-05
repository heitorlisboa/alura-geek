import type { ForwardedRef, MutableRefObject, RefCallback } from "react";

export type AnyMutableRef<T> =
  | RefCallback<T>
  | MutableRefObject<T>
  | ForwardedRef<T>;
