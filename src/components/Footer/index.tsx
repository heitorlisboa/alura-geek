import Link from "next/link";
import { useForm } from "react-hook-form";

import styles from "./Footer.module.scss";

import Container from "@components/Container";
import Input from "@components/Input";
import Button from "@components/Button";
import { getFormErrorMessage } from "@src/utils";

type ContactFields = {
  name: string;
  message: string;
};

const Footer = function FooterComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFields>();

  function handleContactMessage(data: ContactFields) {
    // TODO: Improve sent message notification
    alert("Mensagem enviada com sucesso");
    console.log(data);
  }

  return (
    <footer>
      <section className={styles.info} aria-label="Informações e contato">
        <Container className={styles.infoContainer}>
          <img src="/svg/logo.svg" alt="Logo" />

          <nav className={styles.nav}>
            <ul className={styles.navList}>
              <li>
                <Link href="#" scroll={false}>
                  Quem somos nós
                </Link>
              </li>
              <li>
                <Link href="#" scroll={false}>
                  Política de privacidade
                </Link>
              </li>
              <li>
                <Link href="#" scroll={false}>
                  Programa fidelidade
                </Link>
              </li>
              <li>
                <Link href="#" scroll={false}>
                  Nossas lojas
                </Link>
              </li>
              <li>
                <Link href="#" scroll={false}>
                  Quero ser franqueado
                </Link>
              </li>
              <li>
                <Link href="#" scroll={false}>
                  Anuncie aqui
                </Link>
              </li>
            </ul>
          </nav>

          <form
            className={styles.contactForm}
            onSubmit={handleSubmit(handleContactMessage)}
          >
            <h2 className={styles.formTitle}>Fale conosco</h2>

            <div className={styles.formFields}>
              <Input
                id="name"
                label="Nome"
                inputType="text"
                labelVisible
                errorMessage={getFormErrorMessage(errors.name)}
                {...register("name", {
                  required: true,
                  maxLength: {
                    value: 40,
                    message: "Máximo de 40 caracteres",
                  },
                })}
              />

              <Input
                as="textarea"
                id="message"
                label="Mensagem"
                placeholder="Escreva sua mensagem"
                errorMessage={getFormErrorMessage(errors.message)}
                {...register("message", {
                  required: true,
                  maxLength: {
                    value: 120,
                    message: "Máximo de 120 caracteres",
                  },
                })}
              />

              <Button
                className={styles.contactSubmit}
                as="button"
                buttonType="submit"
              >
                Enviar mensagem
              </Button>
            </div>
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
