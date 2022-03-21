import categoriesWithProducts from "../tmp/products.json";

export type CategoryWithProductsType =
  typeof categoriesWithProducts.categories[0];
export type ProductType = CategoryWithProductsType["products"][0];
