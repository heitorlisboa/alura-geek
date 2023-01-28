type PrimitiveType =
  | "bigint"
  | "boolean"
  | "function"
  | "number"
  | "object"
  | "string"
  | "symbol"
  | "undefined";

export class Validator<T extends object, P extends T> {
  constructor(private types: Record<keyof T, PrimitiveType>) {}

  public validate(itemRequest: T, allRequired: true): itemRequest is P;

  public validate(
    itemRequest: Partial<T>,
    allRequired?: false
  ): itemRequest is Partial<P>;

  public validate(itemRequest: T, allRequired = false): itemRequest is P {
    const object = allRequired ? this.types : itemRequest;

    let key: keyof typeof object;
    for (key in object) {
      if (typeof itemRequest[key] !== this.types[key]) return false;
    }

    return true;
  }
}
