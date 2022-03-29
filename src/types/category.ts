import type { Category } from "@prisma/client";

export type ValidCategoryRequest = Omit<Category, "id">;

export type CategoryRequestToValidate = Record<
  keyof ValidCategoryRequest,
  unknown
>;
