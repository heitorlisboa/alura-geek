import Link from "next/link";

import styles from "./Footer.module.scss";

import Container from "../Container";
import Input from "../Input";
import Button from "../Button";

const Footer = function FooterComponent() {
  return (
    <footer>
      <section className={styles.info} aria-label="Informações e contato">
        <Container className={styles.infoContainer}>
          <img src="/svg/logo.svg" alt="Logo" />

          <nav className={styles.nav}>
            <ul className={styles.navList}>
              <li>
                <Link href="/">Quem somos nós</Link>
              </li>
              <li>
                <Link href="/">Política de privacidade</Link>
              </li>
              <li>
                <Link href="/">Programa fidelidade</Link>
              </li>
              <li>
                <Link href="/">Nossas lojas</Link>
              </li>
              <li>
                <Link href="/">Quero ser franqueado</Link>
              </li>
              <li>
                <Link href="/">Anuncie aqui</Link>
              </li>
            </ul>
          </nav>

          <form
            className={styles.contactForm}
            onSubmit={(e) => e.preventDefault()}
          >
            <fieldset className={styles.contactFieldset}>
              <legend>Fale conosco</legend>

              <Input
                id="name"
                name="name"
                label="Nome"
                inputType="text"
                labelVisible
                required
              />

              <Input
                as="textarea"
                id="message"
                name="message"
                label="Mensagem"
                placeholder="Escreva sua mensagem"
                required
              />

              <Button
                className={styles.contactSubmit}
                as="button"
                buttonType="submit"
              >
                Enviar mensagem
              </Button>
            </fieldset>
          </form>
        </Container>
      </section>

      <section className={styles.copyright} aria-label="Copyright">
        <Container>
          <p>Desenvolvido por Heitor Lisboa</p>
          <p>2022</p>
        </Container>
      </section>
    </footer>
  );
};

export default Footer;
