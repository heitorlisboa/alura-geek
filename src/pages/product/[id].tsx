import type {
  GetStaticPaths,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { z } from "zod";

import styles from "@/styles/pages/Product.module.scss";

import { Fallback } from "@/components/Fallback";
import { Container } from "@/components/Container";
import { ProductsCategory } from "@/components/ProductsCategory";
import { prisma } from "@/server/db/client";
import { formatPrice } from "@/utils";

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
              quality={100}
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
          priority
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

export async function getStaticProps(context: GetStaticPropsContext) {
  const paramsSchema = z.object({ id: z.string().uuid() });
  const paramsParseResult = paramsSchema.safeParse(context.params);

  if (!paramsParseResult.success)
    return { notFound: true } satisfies GetStaticPropsResult<unknown>;

  const { id } = paramsParseResult.data;

  const product = await prisma.product.findUnique({ where: { id } });

  if (!product)
    return { notFound: true } satisfies GetStaticPropsResult<unknown>;

  const category = await prisma.category.findUnique({
    where: { id: product.categoryId },
    include: { products: { orderBy: { updatedAt: "desc" } } },
  });

  if (!category)
    return { notFound: true } satisfies GetStaticPropsResult<unknown>;

  return {
    props: {
      product,
      category,
    },
    revalidate: 60 * 60, // 1 hour
  } satisfies GetStaticPropsResult<unknown>;
}

export default ProductPage;
