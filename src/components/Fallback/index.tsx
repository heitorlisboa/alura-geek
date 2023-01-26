import Head from "next/head";

import styles from "./Fallback.module.scss";

import { Container } from "@components/Container";

export const Fallback = () => (
  <>
    <Head>
      <title>Gerando página</title>
    </Head>

    <main id="main-content">
      <Container className={styles.container}>
        <h2>Gerando página...</h2>
      </Container>
    </main>
  </>
);
