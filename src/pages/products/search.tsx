import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { z } from "zod";

import styles from "@/styles/pages/SearchProducts.module.scss";

import { Container } from "@/components/Container";
import { ProductItem } from "@/components/ProductItem";
import { prisma } from "@/lib/prisma";

type SearchProductsPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const SearchProductsPage: NextPage<SearchProductsPageProps> = ({
  productSearchQuery,
  productsFound,
}) => {
  const pageTitleId = "search-products-title";

  return (
    <>
      <Head>
        <title>{`Buscando "${productSearchQuery}"`}</title>
      </Head>

      <main id="main-content">
        <Container className={styles.container}>
          <h2 id={pageTitleId} className={styles.title}>
            Resultados da busca de &quot;{productSearchQuery}&quot;
          </h2>

          {productsFound.length > 0 ? (
            <ul className={styles.productList} aria-labelledby={pageTitleId}>
              {productsFound.map((product, index) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  priority={index < 6 * 2 /* 2 rows of 6 items on desktop */}
                />
              ))}
            </ul>
          ) : (
            <p className={styles.notFoundMessage}>
              O produto que você está buscando não foi encontrado 😥
            </p>
          )}
        </Container>
      </main>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const querySchema = z.object({ q: z.string().min(1) });
  const queryParseResult = querySchema.safeParse(context.query);

  if (!queryParseResult.success)
    return { notFound: true } satisfies GetServerSidePropsResult<unknown>;

  const productSearchQuery = queryParseResult.data.q;

  const productsFound = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: productSearchQuery } },
        { category: { name: { contains: productSearchQuery } } },
      ],
    },
    orderBy: { updatedAt: "desc" },
  });

  return {
    props: {
      productSearchQuery,
      productsFound,
    },
  } satisfies GetServerSidePropsResult<unknown>;
}

export default SearchProductsPage;
