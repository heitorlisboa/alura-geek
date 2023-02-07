import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import type { Product } from "@prisma/client";
import axios from "axios";
import { z } from "zod";

import styles from "@/styles/pages/SearchProducts.module.scss";

import { Container } from "@/components/Container";
import { ProductItem } from "@/components/ProductItem";
import { getBaseUrl } from "@/utils";

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
        <title>Buscando &quot;{productSearchQuery}&quot;</title>
      </Head>

      <main id="main-content">
        <Container className={styles.container}>
          <h2 id={pageTitleId} className={styles.title}>
            Resultados da busca de &quot;{productSearchQuery}&quot;
          </h2>

          {productsFound.length > 0 ? (
            <ul className={styles.productList} aria-labelledby={pageTitleId}>
              {productsFound.map((product) => (
                <ProductItem key={product.id} product={product} />
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

  const baseUrl = getBaseUrl();

  const productsFound: Product[] = (
    await axios.get(`${baseUrl}/api/products/search?q=${productSearchQuery}`)
  ).data;

  return {
    props: {
      productSearchQuery,
      productsFound,
    },
  } satisfies GetServerSidePropsResult<unknown>;
}

export default SearchProductsPage;
