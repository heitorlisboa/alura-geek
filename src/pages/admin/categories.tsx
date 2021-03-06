import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { Accordion, AccordionItem, Modal } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import type { GetServerSideProps, NextPage } from "next";
import type { Category } from "@prisma/client";

import styles from "@page-styles/admin/Categories.module.scss";

import Container from "@components/Container";
import Button from "@components/Button";
import TrashSvg from "@icons/TrashSvg";
import PencilSvg from "@icons/PencilSvg";
import { getBaseUrl } from "@src/utils";
import { useWindowSize } from "@src/hooks/useWindowSize";
import type { CategoryWithProducts } from "@src/types/category";

type ManageCategoriesProps = {
  categories: CategoryWithProducts[];
};

const ManageCategories: NextPage<ManageCategoriesProps> =
  function ManageCategoriesPage({ categories: initialCategories }) {
    const pageTitleId = "admin-all-categories-title";

    const windowSize = useWindowSize();
    const mobile = windowSize < 768;

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
              title="Tem certeza que quer excluir essa categoria?"
              opened={modalOpened}
              onClose={handleCloseModal}
              closeButtonLabel="Cancelar de dele????o de categoria"
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

            <Accordion
              role="list"
              aria-labelledby={pageTitleId}
              offsetIcon={!mobile}
            >
              {categories.map((category) => (
                <AccordionItem
                  key={category.id}
                  label={category.name}
                  role="listitem"
                >
                  <div className={styles.categoryButtons}>
                    <button onClick={() => handleOpenModal(category.id)}>
                      <span className="sr-only">Excluir categoria</span>
                      <TrashSvg />
                    </button>

                    <Link href={`/admin/category/${category.id}`}>
                      <a>
                        <span className="sr-only">Editar categoria</span>
                        <PencilSvg />
                      </a>
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
                </AccordionItem>
              ))}
            </Accordion>
          </Container>
        </main>
      </>
    );
  };

export const getServerSideProps: GetServerSideProps = async (context) => {
  const baseUrl = getBaseUrl(context.req.headers);

  const { data: categories } = await axios.get(
    `${baseUrl}/api/categories?withProducts=true`
  );

  return {
    props: {
      categories,
    },
  };
};

export default ManageCategories;
