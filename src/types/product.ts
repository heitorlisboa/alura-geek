// TODO: Remove old types
import type { Product } from "@prisma/client";

import categoriesWithProducts from "../tmp/products.json";

export type CategoryWithProductsType =
  typeof categoriesWithProducts.categories[0];
export type ProductType = CategoryWithProductsType["products"][0];

export type ValidProductRequest = Omit<
  Product,
  "id" | "imageUrl" | "categoryId" | "createdAt" | "updatedAt"
> & { base64Image: string; categoryName: string };

export type ProductRequestToValidate = Record<
  keyof ValidProductRequest,
  unknown
>;
