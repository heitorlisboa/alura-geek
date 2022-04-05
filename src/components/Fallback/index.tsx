import Head from "next/head";

import styles from "./Fallback.module.scss";

import Container from "@components/Container";

const Fallback = function FallbackComponent() {
  return (
    <>
      <Head>
        <title>Gerando página</title>
      </Head>
      <main>
        <Container className={styles.container}>
          <h2>Gerando página...</h2>
        </Container>
      </main>
    </>
  );
};

export default Fallback;
