import type {
  ProductRequestToValidate,
  ValidProductRequest,
} from "../types/products";

function validateProduct(
  productRequest: ProductRequestToValidate,
  allRequired: true
): productRequest is ValidProductRequest;

function validateProduct(
  productRequest: Partial<ProductRequestToValidate>,
  allRequired?: false
): productRequest is Partial<ValidProductRequest>;

function validateProduct(
  productRequest: ProductRequestToValidate | Partial<ProductRequestToValidate>,
  allRequired: boolean = false
): productRequest is ValidProductRequest | Partial<ValidProductRequest> {
  const types = {
    name: "string",
    price: "number",
    description: "string",
    imageUrl: "string",
    categoryName: "string",
  };

  const keys = allRequired ? types : productRequest;

  let key: keyof typeof keys;
  for (key in keys) {
    if (typeof productRequest[key] !== types[key]) return false;
  }

  return true;
}

export { validateProduct };
