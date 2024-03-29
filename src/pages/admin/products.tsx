import type {
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Modal } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { TRPCClientError } from "@trpc/client";

import styles from "@/styles/pages/admin/Products.module.scss";

import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { TrashSvg } from "@/icons/TrashSvg";
import { PencilSvg } from "@/icons/PencilSvg";
import { BrandLink } from "@/components/BrandLink";
import { prisma } from "@/server/db/client";
import { formatPrice, trpc } from "@/utils";

type ManageProductsPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const ManageProductsPage: NextPage<ManageProductsPageProps> = ({
  initialProducts,
}) => {
  const pageTitleId = "admin-all-products-title";

  const productDeleteMutation = trpc.product.delete.useMutation();

  const [products, setProducts] = useState(initialProducts);
  const [modalOpened, setModalOpened] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<string>("");

  function handleOpenModal(productId: string) {
    setModalOpened(true);
    setProductIdToDelete(productId);
  }

  function handleCloseModal() {
    setModalOpened(false);
    setProductIdToDelete("");
  }

  async function handleDeleteProduct() {
    // Closing the modal after confirming the action
    handleCloseModal();

    // Loading notification
    const notificationId = `delete-product-${randomId()}`;
    showNotification({
      id: notificationId,
      message: "Deletando produto, espere um momento...",
      loading: true,
      autoClose: false,
      disallowClose: true,
    });

    try {
      // Product deletion request
      const deletedProduct = (
        await productDeleteMutation.mutateAsync({ id: productIdToDelete })
      ).product;

      // Removing the product from the `products` state
      setProducts((prevState) =>
        prevState.filter((product) => product.id !== deletedProduct.id)
      );

      // Success notification
      updateNotification({
        id: notificationId,
        color: "green",
        message: "Produto deletado com sucesso!",
      });
    } catch (error) {
      // Error notification
      updateNotification({
        id: notificationId,
        color: "red",
        message:
          error instanceof TRPCClientError
            ? error.message
            : "Erro desconhecido",
      });
    }
  }

  return (
    <>
      <Head>
        <title>Admin - Todos os produtos</title>
      </Head>

      <main id="main-content">
        <Container className={styles.container}>
          <Modal
            title="Tem certeza que quer excluir esse produto?"
            opened={modalOpened}
            onClose={handleCloseModal}
            closeButtonLabel="Cancelar de deleção de produto"
          >
            <Button onClick={handleDeleteProduct}>Confirmar</Button>
          </Modal>

          <header className={styles.header}>
            <h2 id={pageTitleId} className={styles.title}>
              Todos os produtos
            </h2>
            <Button as="link" linkHref="/admin/product/new">
              Adicionar produto
            </Button>
          </header>

          <ul className={styles.productList} aria-labelledby={pageTitleId}>
            {products.map((product, index) => (
              <li className={styles.product} key={product.id}>
                <Image
                  className={styles.productImage}
                  src={product.imageUrl}
                  alt={`Foto de ${product.name}`}
                  width={250}
                  height={250}
                  priority={index < 6 * 2 /* 2 rows of 6 items on desktop */}
                />

                <div className={styles.productButtons}>
                  <button onClick={() => handleOpenModal(product.id)}>
                    <span className="sr-only">Excluir produto</span>
                    <TrashSvg />
                  </button>
                  <Link href={`/admin/product/${product.id}`}>
                    <span className="sr-only">Editar produto</span>
                    <PencilSvg />
                  </Link>
                </div>

                <h3 className={styles.productTitle}>{product.name}</h3>
                <p>
                  <strong>{formatPrice(product.price)}</strong>
                </p>
                <p className={styles.productId} aria-label="Id do produto">
                  {product.id}
                </p>
                <p>
                  <BrandLink href={`/product/${product.id}`}>
                    Ver produto
                  </BrandLink>
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </main>
    </>
  );
};

export async function getServerSideProps() {
  const initialProducts = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return {
    props: {
      initialProducts,
    },
  } satisfies GetServerSidePropsResult<unknown>;
}

export default ManageProductsPage;
