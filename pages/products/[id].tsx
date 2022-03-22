import Head from "next/head";
import Image from "next/image";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

import styles from "../../src/styles/pages/Product.module.scss";

import Container from "../../src/components/Container";
import ProductsCategory from "../../src/components/ProductsCategory";
import { classNames, formatPrice } from "../../src/utils";
import {
  getProduct,
  getAllProducts,
  getCategoryByProduct,
} from "../../src/tmp";
import type { ProductType } from "../../src/types";

import categoriesWithProducts from "../../src/tmp/products.json";

export const getStaticPaths: GetStaticPaths = () => {
  const paths = getAllProducts(categoriesWithProducts.categories).map(
    (product) => ({
      params: {
        id: product.id.toString(),
      },
    })
  );

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<any, { id: string }> = (
  context
) => {
  if (context.params === undefined) return { props: {} };

  const { id } = context.params;

  const product = getProduct(
    categoriesWithProducts.categories,
    parseInt(id as string)
  );

  return {
    props: {
      product: product,
    },
  };
};

type ProductProps = {
  product: ProductType;
};

const Product: NextPage<ProductProps> = function ProductPage({ product }) {
  const categorySameAsProduct = getCategoryByProduct(
    categoriesWithProducts.categories,
    product.id
  );

  return (
    <>
      <Head>
        <title>{product.name}</title>
      </Head>

      <main {...classNames([styles.main, "no-collapse"])}>
        <Container className={styles.productContainer}>
          <article className={styles.product}>
            <Image
              src={product.image}
              alt={product.name}
              width={600}
              height={400}
              layout="responsive"
              objectFit="cover"
              priority
            />

            <div className={styles.productInfo}>
              <h2 className={styles.productTitle}>{product.name}</h2>
              <p>
                <strong>{formatPrice(product.price)}</strong>
              </p>
              <p className={styles.productDescription}>{product.description}</p>
            </div>
          </article>
        </Container>

        <ProductsCategory
          title="Produtos similares"
          products={categorySameAsProduct.products}
        />
      </main>
    </>
  );
};

export default Product;
