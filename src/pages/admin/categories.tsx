import type {
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { Accordion, Modal } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import type { Category } from "@prisma/client";
import axios from "axios";

import styles from "@/styles/pages/admin/Categories.module.scss";

import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { TrashSvg } from "@/icons/TrashSvg";
import { PencilSvg } from "@/icons/PencilSvg";
import { prisma } from "@/server/db/client";

type ManageCategoriesPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const ManageCategoriesPage: NextPage<ManageCategoriesPageProps> = ({
  initialCategories,
}) => {
  const pageTitleId = "admin-all-categories-title";

  const [categories, setCategories] = useState(initialCategories);
  const [modalOpened, setModalOpened] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<string>("");

  function handleOpenModal(categoryId: string) {
    setModalOpened(true);
    setCategoryIdToDelete(categoryId);
  }

  function handleCloseModal() {
    setModalOpened(false);
    setCategoryIdToDelete("");
  }

  function handleDeleteCategory() {
    // Closing the modal after confirming the action
    handleCloseModal();

    // Loading notification
    const notificationId = `delete-category-${randomId()}`;
    showNotification({
      id: notificationId,
      message: "Deletando categoria, espere um momento...",
      loading: true,
      autoClose: false,
      disallowClose: true,
    });
    // Category deletion request
    axios
      .delete(`/api/category/${categoryIdToDelete}`)
      .then(({ data: deletedCategory }: { data: Category }) => {
        // Removing the category from the `categories` state
        setCategories((prevState) =>
          prevState.filter((category) => category.id !== deletedCategory.id)
        );

        // Success notification
        updateNotification({
          id: notificationId,
          color: "green",
          message: "Categoria deletada com sucesso!",
        });
      })
      .catch((err) => {
        // Error notification
        updateNotification({
          id: notificationId,
          color: "red",
          title: err.response.data.error || "Erro ao deletar categoria",
          message: err.response.data.message || "Erro desconhecido",
        });
      });
  }

  return (
    <>
      <Head>
        <title>Admin - Todas as categorias</title>
      </Head>

      <main id="main-content">
        <Container className={styles.container}>
          <Modal
            title="Tem certeza que quer excluir essa categoria? Seus produtos (se houverem) também serão excluídos."
            opened={modalOpened}
            onClose={handleCloseModal}
            closeButtonLabel="Cancelar de deleção de categoria"
          >
            <Button onClick={handleDeleteCategory}>Confirmar</Button>
          </Modal>

          <header className={styles.header}>
            <h2 id={pageTitleId} className={styles.title}>
              Todas as categorias
            </h2>
            <Button as="link" linkHref="/admin/category/new">
              Adicionar categoria
            </Button>
          </header>

          <Accordion chevronPosition="left" aria-labelledby={pageTitleId}>
            {categories.map((category) => (
              <Accordion.Item key={category.id} value={category.name}>
                <Accordion.Control>{category.name}</Accordion.Control>
                <Accordion.Panel className={styles.categoryAccordionPanel}>
                  <div className={styles.categoryButtons}>
                    <button onClick={() => handleOpenModal(category.id)}>
                      <span className="sr-only">Excluir categoria</span>
                      <TrashSvg />
                    </button>

                    <Link href={`/admin/category/${category.id}`}>
                      <span className="sr-only">Editar categoria</span>
                      <PencilSvg />
                    </Link>
                  </div>

                  <ul className={styles.productList}>
                    {category.products.map((product) => (
                      <li key={product.id} className={styles.product}>
                        <span className={styles.productName}>
                          {product.name}
                        </span>{" "}
                        <span
                          className={styles.productId}
                          aria-label="Id do produto"
                        >
                          {product.id}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Container>
      </main>
    </>
  );
};

export async function getServerSideProps() {
  const initialCategories = await prisma.category.findMany({
    include: { products: { orderBy: { updatedAt: "desc" } } },
  });

  return {
    props: {
      initialCategories,
    },
  } satisfies GetServerSidePropsResult<unknown>;
}

export default ManageCategoriesPage;
