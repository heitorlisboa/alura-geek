import { z, type ZodError } from "zod";

function immutablyDeleteProperties<T extends object, K extends keyof T>(
  object: T,
  properties: K[]
): Omit<T, K> {
  const objectCopy = { ...object };
  for (const property of properties) {
    delete objectCopy[property];
  }
  return objectCopy;
}

export function formatZodError<T>(zodError: ZodError<T>) {
  const baseFormattedError = zodError.format();

  /**
   * When using a non-object schema, the error object only contains the
   * `_errors` property
   *
   * @example
   * ```
   * // Non-object schema
   * z.string()
   * // Error example of this schema
   * { _errors: [...] }
   * ```
   */
  const zodErrorForNonObjectSchema = z
    .object({
      _errors: z.string().array(),
    })
    .strict();

  const zodErrorForNonObjectParseResult =
    zodErrorForNonObjectSchema.safeParse(baseFormattedError);
  if (zodErrorForNonObjectParseResult.success) {
    return zodErrorForNonObjectParseResult.data._errors;
  }

  /**
   * When using an object schema, the error object contains the `_errors`
   * property as an empty array and other properties with its correspondent
   * errors
   *
   * @example
   * ```
   * // Object schema
   * z.object({ name: z.string() })
   * // Error example of this schema
   * { _errors: [], name: { _errors: [...] } }
   * ```
   */
  const formattedError = immutablyDeleteProperties(baseFormattedError, [
    "_errors",
  ]);

  return formattedError;
}
