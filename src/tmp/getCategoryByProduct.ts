import type { CategoryWithProductsType } from "../types";

function getCategoryByProduct(
  categoriesWithProducts: CategoryWithProductsType[],
  productId: number
) {
  const category = categoriesWithProducts.filter(({ products }) => {
    let productIsInCategory = false;

    products.forEach((product) => {
      if (product.id === productId) {
        productIsInCategory = true;
      }
    });

    return productIsInCategory;
  })[0];

  return category;
}

export { getCategoryByProduct };
