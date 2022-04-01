import type { Product } from "@prisma/client";

export type ValidProductRequest = Omit<
  Product,
  "id" | "imageUrl" | "categoryId" | "createdAt" | "updatedAt"
> & { base64Image: string; categoryName: string };

export type ProductRequestToValidate = Record<
  keyof ValidProductRequest,
  unknown
>;
