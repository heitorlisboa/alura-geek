import Head from "next/head";
import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";
import type { Product } from "@prisma/client";

import styles from "@page-styles/SearchProducts.module.scss";

import Container from "@src/components/Container";
import ProductItem from "@src/components/ProductItem";
import { getBaseUrl } from "@src/utils";

type SearchProductsPageProps = {
  query: string;
  productsFound: Product[];
};

const SearchProductsPage: NextPage<SearchProductsPageProps> = ({
  query,
  productsFound,
}) => {
  const pageTitleId = "search-products-title";

  return (
    <>
      <Head>
        <title>Buscando &quot;{query}&quot;</title>
      </Head>

      <main id="main-content">
        <Container className={styles.container}>
          <h2 id={pageTitleId} className={styles.title}>
            Resultados da busca de &quot;{query}&quot;
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const baseUrl = getBaseUrl(context.req.headers);
  const { q } = context.query;

  if (typeof q !== "string") return { notFound: true };

  const { data: productsFound } = await axios.get(
    `${baseUrl}/api/products/search?q=${q}`
  );

  return {
    props: {
      query: q,
      productsFound,
    },
  };
};

export default SearchProductsPage;
