import { Validator } from "./Validator";
import type {
  ProductRequestToValidate,
  ValidProductRequest,
} from "../types/product";

const productValidator = new Validator<
  ProductRequestToValidate,
  ValidProductRequest
>({
  name: "string",
  price: "number",
  description: "string",
  base64Image: "string",
  categoryName: "string",
});

export { productValidator };
