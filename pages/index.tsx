import Head from "next/head";
import axios from "axios";
import type { GetStaticProps, NextPage } from "next";
import type { Category, Product } from "@prisma/client";

import styles from "@page-styles/Home.module.scss";

import Container from "@components/Container";
import Button from "@components/Button";
import ProductsCategory from "@components/ProductsCategory";

type HomeProps = {
  products: Product[];
  categories: Category[];
};

const Home: NextPage<HomeProps> = function HomePage({ products, categories }) {
  return (
    <>
      <Head>
        <title>AluraGeek - Página inicial</title>
      </Head>

      <main>
        <section className={styles.hero} aria-labelledby="hero-title">
          <Container className={styles.heroContainer}>
            <h2 id="hero-title" className={styles.heroTitle}>
              Dezembro Promocional
            </h2>
            <p className={styles.heroParagraph}>
              <strong>Produtos selecionados com 33% de desconto</strong>
            </p>
            <Button
              as="link"
              linkHref={
                "/category/" +
                categories.find(({ name }) => name === "Consoles")?.id
              }
            >
              Ver Consoles
            </Button>
          </Container>
        </section>

        {categories.map((category) => (
          <ProductsCategory
            key={category.id}
            title={category.name}
            categoryLinkHref={`/category/${category.id}`}
            products={products.filter(
              (product) => product.categoryId === category.id
            )}
          />
        ))}
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data: products } = await axios.get(
    "http://localhost:3000/api/products"
  );
  const { data: categories } = await axios.get(
    "http://localhost:3000/api/categories"
  );

  return {
    props: {
      products,
      categories,
    },
    revalidate: 60 * 60, // 1 hour
  };
};

export default Home;
