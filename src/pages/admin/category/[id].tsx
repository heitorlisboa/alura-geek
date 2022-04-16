import Head from "next/head";
import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";
import type { Category } from "@prisma/client";

import Container from "@components/Container";
import CategoryForm from "@components/CategoryForm";
import ProductsSelection from "@components/ProductsSelection";
import { getBaseUrl } from "@src/utils";
import type { CategoryWithProducts } from "@src/types/category";

type EditCategoryProps = {
  category: CategoryWithProducts;
  categories: Category[];
};

const EditCategory: NextPage<EditCategoryProps> = function EditCategoryPage({
  category,
  categories,
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
          <ProductsSelection
            products={category.products}
            categories={categories}
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
  const { data: categories }: { data: Category[] } = await axios.get(
    `${baseUrl}/api/categories`
  );

  return {
    props: {
      category,
      /* Filtering the categories since they will be used to select a category
      to move the selected products to, and it doesn't make sense to move a
      product to the same category it already is */
      categories: categories.filter(
        (currentCategory) => currentCategory.id !== category.id
      ),
    },
  };
};

export default EditCategory;
