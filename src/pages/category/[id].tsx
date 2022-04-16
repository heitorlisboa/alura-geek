import Head from "next/head";
import { useRouter } from "next/router";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

import styles from "@page-styles/Category.module.scss";

import Fallback from "@components/Fallback";
import Container from "@components/Container";
import ProductItem from "@components/ProductItem";
import { prisma } from "@src/lib/prisma";
import type { CategoryWithProducts } from "@src/types/category";

type CategoryProps = {
  category: CategoryWithProducts;
};

const Category: NextPage<CategoryProps> = function CategoryPage({ category }) {
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

export const getStaticProps: GetStaticProps<any, { id: string }> = async (
  context
) => {
  if (!context.params) return { notFound: true };

  const { id } = context.params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: { products: { orderBy: { updatedAt: "desc" } } },
  });

  if (!category) return { notFound: true };

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
  };
};

export default Category;
