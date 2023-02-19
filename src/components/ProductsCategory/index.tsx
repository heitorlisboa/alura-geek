import type { FC } from "react";
import type { Product } from "@prisma/client";

import styles from "./ProductsCategory.module.scss";

import { Container } from "@/components/Container";
import { BrandLink } from "@/components/BrandLink";
import { ArrowRightSvg } from "@/icons/ArrowRightSvg";
import { ProductItem } from "@/components/ProductItem";

type ProductsCategoryProps = {
  title: string;
  products: Product[];
  categoryLinkHref?: string;
  priority?: boolean;
};

export const ProductsCategory: FC<ProductsCategoryProps> = ({
  title,
  categoryLinkHref,
  products,
  priority = false,
}) => {
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
          {products.slice(0, 6).map((product, index) => (
            <ProductItem
              key={product.id}
              product={product}
              priority={priority}
              shouldHideOnMobile={index > 3}
            />
          ))}
        </ul>
      </Container>
    </section>
  );
};
