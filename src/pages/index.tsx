import Head from "next/head";
import type {
  GetStaticPropsResult,
  InferGetStaticPropsType,
  NextPage,
} from "next";

import styles from "@page-styles/Home.module.scss";

import { Container } from "@components/Container";
import { Button } from "@components/Button";
import { ProductsCategory } from "@components/ProductsCategory";
import { prisma } from "@src/lib/prisma";

type HomePageProps = InferGetStaticPropsType<typeof getStaticProps>;

const HomePage: NextPage<HomePageProps> = ({ products, categories }) => (
  <>
    <Head>
      <title>AluraGeek - Página inicial</title>
    </Head>

    <main id="main-content">
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

      {categories.map((category) => {
        const categoryProducts = products
          .filter((product) => product.categoryId === category.id)
          .map((product) => ({
            ...product,
            createdAt: new Date(product.createdAt),
            updatedAt: new Date(product.updatedAt),
          }));
        if (categoryProducts.length > 0) {
          return (
            <ProductsCategory
              key={category.id}
              title={category.name}
              categoryLinkHref={`/category/${category.id}`}
              products={categoryProducts}
            />
          );
        }
      })}
    </main>
  </>
);

export async function getStaticProps() {
  const products = (
    await prisma.product.findMany({ orderBy: { updatedAt: "desc" } })
  ).map((product) => ({
    ...product,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }));
  const categories = await prisma.category.findMany();

  return {
    props: {
      products,
      categories,
    },
    revalidate: 60 * 60, // 1 hour
  } satisfies GetStaticPropsResult<unknown>;
}

export default HomePage;
