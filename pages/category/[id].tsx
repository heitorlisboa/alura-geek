import Head from "next/head";
import axios from "axios";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type { Category } from "@prisma/client";

import styles from "@page-styles/Category.module.scss";

import Container from "@components/Container";
import ProductItem from "@components/ProductItem";
import type { CategoryWithProducts } from "@src/types/category";

type CategoryProps = {
  category: CategoryWithProducts;
};

const Category: NextPage<CategoryProps> = function CategoryPage({ category }) {
  const categoryTitleId = `${category.name.toLowerCase()}-category-title`;

  return (
    <>
      <Head>
        <title>Categoria {category.name}</title>
      </Head>

      <main>
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
  const { data: categories }: { data: Category[] } = await axios.get(
    "http://localhost:3000/api/categories"
  );

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
  if (!context.params) return { props: {} };

  const { id } = context.params;

  const { data: category }: { data: Category } = await axios.get(
    `http://localhost:3000/api/category/${id}`
  );

  return {
    props: {
      category,
    },
    revalidate: 60 * 60, // 1 hour
  };
};

export default Category;
