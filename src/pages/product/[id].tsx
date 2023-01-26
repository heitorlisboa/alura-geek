import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
  NextPage,
} from "next";

import styles from "@page-styles/Product.module.scss";

import { Fallback } from "@components/Fallback";
import { Container } from "@components/Container";
import { ProductsCategory } from "@components/ProductsCategory";
import { formatPrice } from "@src/utils";
import { prisma } from "@src/lib/prisma";

type ProductPageProps = InferGetStaticPropsType<typeof getStaticProps>;

const ProductPage: NextPage<ProductPageProps> = ({ product, category }) => {
  const { isFallback } = useRouter();

  if (isFallback) return <Fallback />;

  return (
    <>
      <Head>
        <title>{product.name}</title>
      </Head>

      <main id="main-content">
        <Container className={styles.productContainer}>
          <article className={styles.product}>
            <Image
              className={styles.productImage}
              src={product.imageUrl}
              alt={product.name}
              width={600}
              height={400}
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
  const products = await prisma.product.findMany();

  const paths = products.map((product) => ({
    params: {
      id: product.id,
    },
  }));

  return {
    paths,
    fallback: true,
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  if (!context.params)
    return { notFound: true } satisfies GetStaticPropsResult<unknown>;

  const { id } = context.params;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!product)
    return { notFound: true } satisfies GetStaticPropsResult<unknown>;

  product.createdAt = product.createdAt.toISOString() as any;
  product.updatedAt = product.updatedAt.toISOString() as any;

  const category = await prisma.category.findUnique({
    where: { id: product.categoryId },
    include: { products: { orderBy: { updatedAt: "desc" } } },
  });

  if (!category)
    return { notFound: true } satisfies GetStaticPropsResult<unknown>;

  category.products = category.products.map((product) => ({
    ...product,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  })) as any;

  return {
    props: {
      product,
      category,
    },
    revalidate: 60 * 60, // 1 hour
  } satisfies GetStaticPropsResult<unknown>;
}

export default ProductPage;
