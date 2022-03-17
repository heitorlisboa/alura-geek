import Head from "next/head";
import type { NextPage } from "next";

import styles from "../src/styles/pages/Home.module.scss";

import Header from "../src/components/Header";
import Container from "../src/components/Container";
import Button from "../src/components/Button";
import ProductsCategory from "../src/components/ProductsCategory";

import products from "../src/tmp/products.json";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>AluraGeek - Página inicial</title>
      </Head>

      <Header />

      <section className={styles.hero} aria-labelledby="hero-title">
        <Container className={styles.heroContainer}>
          <h2 id="hero-title" className={styles.heroTitle}>
            Dezembro Promocional
          </h2>
          <p className={styles.heroParagraph}>
            <strong>Produtos selecionados com 33% de desconto</strong>
          </p>
          <Button as="link" linkHref="/products/category/consoles">
            Ver Consoles
          </Button>
        </Container>
      </section>

      {products.categories.map((category, index) => (
        <ProductsCategory
          key={index}
          title={category.category}
          categoryLinkHref={
            "/products/category/" +
            products.categories[0].category.toLowerCase()
          }
          products={category.products}
        />
      ))}
    </>
  );
};

export default Home;
