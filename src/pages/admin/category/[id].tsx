import Head from "next/head";
import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";
import type { Category } from "@prisma/client";

import Container from "@components/Container";
import CategoryForm from "@components/CategoryForm";
import { getBaseUrl } from "@src/utils";

type EditCategoryProps = {
  category: Category;
};

const EditCategory: NextPage<EditCategoryProps> = function EditCategoryPage({
  category,
}) {
  return (
    <>
      <Head>
        <title>Admin - Editar categoria</title>
      </Head>

      <main id="main-content" className="relative">
        <Container>
          <CategoryForm
            action="update"
            initialValues={{ categoryName: category.name }}
          />
        </Container>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context.params) return { notFound: true };

  const baseUrl = getBaseUrl(context.req.headers);

  const { id } = context.params;

  const { data: category } = await axios.get(`${baseUrl}/api/category/${id}`);

  return {
    props: {
      category,
    },
  };
};

export default EditCategory;
