import type {
  CategoryRequestToValidate,
  ValidCategoryRequest,
} from "@src/types/category";

import { Validator } from "./Validator";

const categoryValidator = new Validator<
  CategoryRequestToValidate,
  ValidCategoryRequest
>({ name: "string" });

export { categoryValidator };
