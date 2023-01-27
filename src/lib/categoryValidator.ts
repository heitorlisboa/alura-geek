import type {
  CategoryRequestToValidate,
  ValidCategoryRequest,
} from "@/types/category";

import { Validator } from "./Validator";

export const categoryValidator = new Validator<
  CategoryRequestToValidate,
  ValidCategoryRequest
>({ name: "string" });
