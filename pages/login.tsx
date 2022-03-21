import Head from "next/head";
import type { NextPage } from "next";

import styles from "../src/styles/pages/Login.module.scss";

import Container from "../src/components/Container";
import Input from "../src/components/Input";
import Button from "../src/components/Button"

const Login: NextPage = function LoginPage() {
  return (
    <>
      <Head>
        <title>AluraGeek - Login</title>
      </Head>

      <main className={styles.main}>
        <Container>
          <form
            className={styles.loginForm}
            onSubmit={(e) => e.preventDefault()}
          >
            <fieldset className={styles.loginFieldset}>
              <legend>Iniciar Sessão</legend>
              <Input
                id="email-address"
                name="email"
                label="Email"
                inputType="email"
                placeholder="Escreva seu email"
                required
              />
              <Input
                id="password"
                name="password"
                label="Senha"
                inputType="password"
                placeholder="Escreva sua senha"
                required
              />
              <Button className={styles.submitButton} as="button" buttonType="submit">
                Entrar
              </Button>
            </fieldset>
          </form>
        </Container>
      </main>
    </>
  );
};

export default Login;
