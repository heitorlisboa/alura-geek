import Head from "next/head";
import type { NextPage } from "next";

import styles from "@/styles/pages/404.module.scss";

import { Container } from "@/components/Container";

const Error404Page: NextPage = () => (
  <>
    <Head>
      <title>404: Página não encontrada</title>
    </Head>

    <main id="main-content">
      <Container className={styles.container}>
        <h2 className={styles.title}>404</h2>
        <p className={styles.text}>
          Parece que a página que você está tentando acessar não existe...
        </p>
      </Container>
    </main>
  </>
);

export default Error404Page;
