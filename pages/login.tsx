import Head from "next/head";
import { getSession, signIn } from "next-auth/react";
import type { GetServerSideProps, NextPage } from "next";

import styles from "../src/styles/pages/Login.module.scss";

import Container from "../src/components/Container";
import Button from "../src/components/Button";
import GitHubSvg from "../src/icons/GitHubSvg";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/admin/products",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const Login: NextPage = function LoginPage() {
  function handleSignIn() {
    signIn("github");
  }

  return (
    <>
      <Head>
        <title>AluraGeek - Login</title>
      </Head>

      <main className={styles.main}>
        <Container className={styles.container}>
          <h2 className={styles.title}>Iniciar Sessão</h2>

          <Button
            className={styles.loginButton}
            as="button"
            variant="outlined"
            buttonType="button"
            onClick={handleSignIn}
          >
            <GitHubSvg />
            Fazer login com GitHub
          </Button>
        </Container>
      </main>
    </>
  );
};

export default Login;
