import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showNotification } from "@mantine/notifications";
import { z } from "zod";

import styles from "./Footer.module.scss";

import { Container } from "@/components/Container";
import { LogoSvg } from "@/icons/LogoSvg";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export const Footer = () => {
  type ContactFormSchema = z.infer<typeof contactFormSchema>;

  const contactFormSchema = z.object({
    name: z.string().min(1, "Obrigatório").max(40, "Máximo de 40 caracteres"),
    message: z
      .string()
      .min(1, "Obrigatório")
      .max(120, "Máximo de 120 caracteres"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
  });

  function handleContactMessage(data: ContactFormSchema) {
    showNotification({
      color: "green",
      message: "Mensagem enviada com sucesso",
    });
    console.log(data);
  }

  return (
    <footer>
      <section className={styles.info} aria-label="Informações e contato">
        <Container className={styles.infoContainer}>
          <Link href="/">
            <span className="sr-only">AluraGeek</span>
            <LogoSvg />
          </Link>

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
                errorMessage={errors.name?.message}
                {...register("name")}
              />

              <Input
                as="textarea"
                id="message"
                label="Mensagem"
                placeholder="Escreva sua mensagem"
                errorMessage={errors.message?.message}
                {...register("message")}
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
