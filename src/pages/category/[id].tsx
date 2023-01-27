import Head from "next/head";
import { useRouter } from "next/router";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
  NextPage,
} from "next";

import styles from "@/styles/pages/Category.module.scss";

import { Fallback } from "@/components/Fallback";
import { Container } from "@/components/Container";
import { ProductItem } from "@/components/ProductItem";
import { prisma } from "@/lib/prisma";

type CategoryPageProps = InferGetStaticPropsType<typeof getStaticProps>;

const CategoryPage: NextPage<CategoryPageProps> = ({ category }) => {
  const { isFallback } = useRouter();

  if (isFallback) return <Fallback />;

  const categoryTitleId = `${category.name.toLowerCase()}-category-title`;

  return (
    <>
      <Head>
        <title>Categoria {category.name}</title>
      </Head>

      <main id="main-content">
        <Container className={styles.container}>
          <h2 id={categoryTitleId} className={styles.title}>
            {category.name}
          </h2>
          <ul className={styles.productList} aria-labelledby={categoryTitleId}>
            {category.products.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </ul>
        </Container>
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await prisma.category.findMany();

  const paths = categories.map((category) => ({
    params: {
      id: category.id,
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

  const category = await prisma.category.findUnique({
    where: { id },
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
      category,
    },
    revalidate: 60 * 60, // 1 hour
  } satisfies GetStaticPropsResult<unknown>;
}

export default CategoryPage;
