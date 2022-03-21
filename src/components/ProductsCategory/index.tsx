import Link from "next/link";
import Image from "next/image";
import React from "react";
import type { FC } from "react";

import styles from "./ProductsCategory.module.scss";

import Container from "../Container";
import ArrowRightSvg from "../../icons/ArrowRightSvg";
import { useWindowSize } from "../../hooks/WindowSize";
import { formatPrice } from "../../utils";

type ProductsCategoryProps = {
  title: string;
  categoryLinkHref: string;
  products: {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
  }[];
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
            <Link href={categoryLinkHref} passHref>
              <a className={styles.seeAllLink}>
                Ver tudo
                <ArrowRightSvg className={styles.linkArrow} />
              </a>
            </Link>
          </header>

          <ul
            className={styles.productList}
            aria-label={`Produtos da categoria ${title}`}
          >
            {products.slice(0, numberOfProducts).map((product, index) => (
              <li className={styles.product} key={index}>
                <Image
                  src={product.image}
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
                <Link href={`/products/${product.id}`} passHref>
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
