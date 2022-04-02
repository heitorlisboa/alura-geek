import Head from "next/head";
import Image from "next/image";
import axios from "axios";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type { Category, Product } from "@prisma/client";

import styles from "@page-styles/Product.module.scss";

import Container from "@components/Container";
import ProductsCategory from "@components/ProductsCategory";
import { formatPrice } from "@src/utils";

type CategoryWithProducts = Category & { products: Product[] };

type ProductProps = {
  product: Product;
  category: CategoryWithProducts;
};

const Product: NextPage<ProductProps> = function ProductPage({
  product,
  category,
}) {
  return (
    <>
      <Head>
        <title>{product.name}</title>
      </Head>

      <main>
        <Container className={styles.productContainer}>
          <article className={styles.product}>
            <Image
              src={product.imageUrl}
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
          products={category.products}
        />
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: products } = await axios.get(
    "http://localhost:3000/api/products"
  );

  const paths = products.map((product: Product) => ({
    params: {
      id: product.id,
    },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<any, { id: string }> = async (
  context
) => {
  if (context.params === undefined) return { props: {} };

  const { id } = context.params;

  const { data: product }: { data: Product } = await axios.get(
    `http://localhost:3000/api/product/${id}`
  );

  const { data: category } = await axios.get(
    `http://localhost:3000/api/category/${product.categoryId}`
  );

  return {
    props: {
      product,
      category,
    },
    revalidate: 60 * 60, // 1 hour
  };
};

export default Product;
