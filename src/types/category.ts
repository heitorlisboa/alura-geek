import type { Category, Product } from "@prisma/client";

export type ValidCategoryRequest = Omit<Category, "id">;

export type CategoryRequestToValidate = Record<
  keyof ValidCategoryRequest,
  unknown
>;

export type CategoryWithProducts = Category & { products: Product[] };
