import type { CategoryWithProductsType } from "../types";

function getProduct(
  categoriesWithProducts: CategoryWithProductsType[],
  idToFind: number
) {
  const foundProduct = categoriesWithProducts
    .map(({ products }) => {
      return products.filter((product) => {
        if (product.id === idToFind) {
          return product;
        }
      })[0];
    })
    .filter((product) => Boolean(product))[0];

  return foundProduct;
}

export { getProduct };
