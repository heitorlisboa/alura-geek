import Head from "next/head";
import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";
import type { Category } from "@prisma/client";

import { Container } from "@components/Container";
import { ProductForm } from "@components/ProductForm";
import { getBaseUrl } from "@src/utils";

type NewProductPageProps = {
  categories: Category[];
};

const NewProductPage: NextPage<NewProductPageProps> = ({ categories }) => (
  <>
    <Head>
      <title>Admin - Adicionar produto</title>
    </Head>

    <main id="main-content" className="relative">
      <Container>
        <ProductForm categories={categories} action="create" />
      </Container>
    </main>
  </>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const baseUrl = getBaseUrl(context.req.headers);

  const { data: categories } = await axios.get(`${baseUrl}/api/categories`);

  return {
    props: {
      categories,
    },
  };
};

export default NewProductPage;
