import Head from "next/head";
import type { NextPage } from "next";

import styles from "../src/styles/pages/Home.module.scss";

import Container from "../src/components/Container";
import Button from "../src/components/Button";
import ProductsCategory from "../src/components/ProductsCategory";

import categoriesWithProducts from "../src/tmp/products.json";

const Home: NextPage = () => {
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
            <Button as="link" linkHref="#">
              Ver Consoles
            </Button>
          </Container>
        </section>

        {categoriesWithProducts.categories.map((category) => (
          <ProductsCategory
            key={category.name}
            title={category.name}
            categoryLinkHref="#"
            products={category.products}
          />
        ))}
      </main>
    </>
  );
};

export default Home;
