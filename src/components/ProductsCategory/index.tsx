import React from "react";
import type { FC } from "react";
import type { Product } from "@prisma/client";

import styles from "./ProductsCategory.module.scss";

import Container from "@components/Container";
import BrandLink from "@components/BrandLink";
import ArrowRightSvg from "@icons/ArrowRightSvg";
import ProductItem from "@components/ProductItem";
import { useWindowSize } from "@src/hooks/WindowSize";

type ProductsCategoryProps = {
  title: string;
  products: Product[];
  categoryLinkHref?: string;
};

const ProductsCategory: FC<ProductsCategoryProps> =
  function ProductsCategoryComponent({ title, categoryLinkHref, products }) {
    const windowSize = useWindowSize();
    const numberOfProducts = windowSize < 1024 ? 4 : 6;

    const categoryTitleId = `${title.toLowerCase()}-category-title`;

    return (
      <section className={styles.category} aria-labelledby={categoryTitleId}>
        <Container>
          <header className={styles.categoryHeader}>
            <h3 className={styles.categoryTitle} id={categoryTitleId}>
              {title}
            </h3>
            {categoryLinkHref && (
              <BrandLink href={categoryLinkHref} className={styles.seeAllLink}>
                Ver tudo
                <ArrowRightSvg className={styles.linkArrow} />
              </BrandLink>
            )}
          </header>

          <ul
            className={styles.productList}
            aria-label={`Produtos da categoria ${title}`}
          >
            {products.slice(0, numberOfProducts).map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </ul>
        </Container>
      </section>
    );
  };

export default ProductsCategory;
