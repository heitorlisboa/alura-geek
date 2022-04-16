import Head from "next/head";
import type { NextPage } from "next";

import Container from "@components/Container";
import CategoryForm from "@components/CategoryForm";

const NewCategory: NextPage = function NewCategoryPage() {
  return (
    <>
      <Head>
        <title>Admin - Adicionar categoria</title>
      </Head>

      <main id="main-content" className="relative">
        <Container>
          <CategoryForm action="create" />
        </Container>
      </main>
    </>
  );
};

export default NewCategory;
