import type { RefCallback, MutableRefObject, ForwardedRef } from "react";

function mergeRefs<T>(
  ...refs: (RefCallback<T> | MutableRefObject<T> | ForwardedRef<T>)[]
) {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs) return null;
  if (filteredRefs.length === 1) return filteredRefs[0];

  return (instance: T) => {
    for (const ref of filteredRefs) {
      if (typeof ref === "function") ref(instance);
      else if (ref) ref.current = instance;
    }
  };
}

export { mergeRefs };
