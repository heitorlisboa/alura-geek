import Head from "next/head";
import Image from "next/image";
import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";
import type { Product } from "@prisma/client";

import styles from "../../src/styles/pages/admin/Products.module.scss";

import Container from "../../src/components/Container";
import Button from "../../src/components/Button";
import TrashSvg from "../../src/icons/TrashSvg";
import PencilSvg from "../../src/icons/PencilSvg";
import { formatPrice } from "../../src/utils";

type ManageProductsProps = {
  products: Product[];
};

const ManageProducts: NextPage<ManageProductsProps> =
  function ManageProductsPage({ products }) {
    return (
      <>
        <Head>
          <title>Admin - Todos os produtos</title>
        </Head>

        <main>
          <Container className={styles.container}>
            <header className={styles.header}>
              <h2 className={styles.title}>Todos os produtos</h2>
              <Button as="link" linkHref="/admin/product/new">
                Adicionar produto
              </Button>
            </header>
            <ul className={styles.productList}>
              {products.map((product) => (
                <li className={styles.product} key={product.id}>
                  <Image
                    src={product.imageUrl}
                    alt={`Foto de ${product.name}`}
                    width={100}
                    height={100}
                    objectFit="cover"
                    layout="responsive"
                  />

                  <div className={styles.productIcons}>
                    <button>
                      <TrashSvg />
                    </button>
                    <button>
                      <PencilSvg />
                    </button>
                  </div>

                  <h3 className={styles.productTitle}>{product.name}</h3>
                  <p>
                    <strong>{formatPrice(product.price)}</strong>
                  </p>
                  <p className={styles.productId}>{product.id}</p>
                </li>
              ))}
            </ul>
          </Container>
        </main>
      </>
    );
  };

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: products } = await axios.get(
    "http://localhost:3000/api/products"
  );

  return {
    props: {
      products,
    },
  };
};

export default ManageProducts;
