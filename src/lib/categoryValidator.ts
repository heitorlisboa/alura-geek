import { Validator } from "./Validator";
import type {
  CategoryRequestToValidate,
  ValidCategoryRequest,
} from "../types/category";

const categoryValidator = new Validator<
  CategoryRequestToValidate,
  ValidCategoryRequest
>({ name: "string" });

export { categoryValidator };
