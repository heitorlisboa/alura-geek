import type { AnyMutableRef } from "@/types/misc";

export function mergeRefs<T>(...refs: AnyMutableRef<T>[]) {
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
