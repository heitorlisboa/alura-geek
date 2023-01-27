import Head from "next/head";
import axios from "axios";
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import type { Category, Product } from "@prisma/client";

import { Container } from "@/components/Container";
import { ProductForm } from "@/components/ProductForm";
import { getBaseUrl } from "@/utils";

type EditProductPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const EditProductPage: NextPage<EditProductPageProps> = ({
  product,
  categories,
}) => {
  const productCategory = categories.find(
    (category) => category.id === product.categoryId
  ) as Category;

  return (
    <>
      <Head>
        <title>Admin - Editar produto</title>
      </Head>

      <main id="main-content" className="relative">
        <Container>
          <ProductForm
            categories={categories}
            action="update"
            initialValues={{
              productImageUrl: product.imageUrl,
              productCategory: productCategory.name,
              productName: product.name,
              productPrice: product.price.toString(),
              productDescription: product.description,
            }}
          />
        </Container>
      </main>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (!context.params) return { notFound: true };

  const baseUrl = getBaseUrl(context.req.headers);

  const { id } = context.params;

  const product: Product = (await axios.get(`${baseUrl}/api/product/${id}`))
    .data;
  const categories: Category[] = (await axios.get(`${baseUrl}/api/categories`))
    .data;

  return {
    props: {
      product,
      categories,
    },
  } satisfies GetServerSidePropsResult<unknown>;
}

export default EditProductPage;
