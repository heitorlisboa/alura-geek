import Link from "next/link";
import Image from "next/image";
import React from "react";
import type { FC } from "react";
import type { Product } from "@prisma/client";

import styles from "./ProductsCategory.module.scss";

import Container from "@components/Container";
import ArrowRightSvg from "@icons/ArrowRightSvg";
import { useWindowSize } from "@src/hooks/WindowSize";
import { formatPrice } from "@src/utils";

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
              <Link href={categoryLinkHref} passHref>
                <a className={styles.seeAllLink}>
                  Ver tudo
                  <ArrowRightSvg className={styles.linkArrow} />
                </a>
              </Link>
            )}
          </header>

          <ul
            className={styles.productList}
            aria-label={`Produtos da categoria ${title}`}
          >
            {products.slice(0, numberOfProducts).map((product) => (
              <li className={styles.product} key={product.id}>
                <Image
                  src={product.imageUrl}
                  alt={`Foto de ${product.name}`}
                  width={100}
                  height={100}
                  objectFit="cover"
                  layout="responsive"
                />

                <h4 className={styles.productTitle}>{product.name}</h4>
                <p>
                  <strong>{formatPrice(product.price)}</strong>
                </p>
                <Link href={`/product/${product.id}`} passHref>
                  <a className={styles.productLink}>Ver produto</a>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    );
  };

export default ProductsCategory;
