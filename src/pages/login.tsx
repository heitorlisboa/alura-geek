import Head from "next/head";
import { getSession, signIn } from "next-auth/react";
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
} from "next";

import styles from "@/styles/pages/Login.module.scss";

import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { GitHubSvg } from "@/icons/GitHubSvg";

const LoginPage: NextPage = () => {
  function handleSignIn() {
    signIn("github");
  }

  return (
    <>
      <Head>
        <title>AluraGeek - Login</title>
      </Head>

      <main id="main-content">
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/admin/products",
        permanent: false,
      },
    } satisfies GetServerSidePropsResult<unknown>;
  }

  return {
    props: {},
  } satisfies GetServerSidePropsResult<unknown>;
}

export default LoginPage;
