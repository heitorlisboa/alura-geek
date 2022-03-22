import type { CategoryWithProductsType } from "../types";

function getAllProducts(categoriesWithProducts: CategoryWithProductsType[]) {
  const allProducts = categoriesWithProducts.flatMap(
    ({ products }) => products
  );

  return allProducts;
}

export { getAllProducts };
