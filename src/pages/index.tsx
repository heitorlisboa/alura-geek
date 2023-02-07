import type {
  GetStaticPropsResult,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";

import styles from "@/styles/pages/Home.module.scss";

import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { ProductsCategory } from "@/components/ProductsCategory";
import { prisma } from "@/lib/prisma";

type HomePageProps = InferGetStaticPropsType<typeof getStaticProps>;

const HomePage: NextPage<HomePageProps> = ({ categories }) => (
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

      {categories.map((category, index) => {
        if (category.products.length > 0) {
          return (
            <ProductsCategory
              key={category.id}
              title={category.name}
              categoryLinkHref={`/category/${category.id}`}
              products={category.products}
              priority={index < 2 /* 2 rows on desktop */}
            />
          );
        }
      })}
    </main>
  </>
);

export async function getStaticProps() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        take: 6,
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  return {
    props: {
      categories,
    },
    revalidate: 60 * 60, // 1 hour
  } satisfies GetStaticPropsResult<unknown>;
}

export default HomePage;
