import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import type { Category } from "@prisma/client";
import axios from "axios";
import { z } from "zod";

import { Container } from "@/components/Container";
import { CategoryForm } from "@/components/CategoryForm";
import { ProductsSelection } from "@/components/ProductsSelection";
import { getBaseUrl } from "@/utils";
import type { CategoryWithProducts } from "@/types/category";

type EditCategoryPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const EditCategoryPage: NextPage<EditCategoryPageProps> = ({
  category,
  otherCategories,
}) => (
  <>
    <Head>
      <title>Admin - Editar categoria</title>
    </Head>

    <main id="main-content" className="relative">
      <Container>
        <CategoryForm action="update" initialValues={{ name: category.name }} />
        <ProductsSelection
          initialProducts={category.products}
          otherCategories={otherCategories}
        />
      </Container>
    </main>
  </>
);

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const paramsSchema = z.object({ id: z.string().uuid() });
  const paramsParseResult = paramsSchema.safeParse(context.params);

  if (!paramsParseResult.success)
    return { notFound: true } satisfies GetServerSidePropsResult<unknown>;

  const baseUrl = getBaseUrl(context.req.headers);

  const { id } = paramsParseResult.data;

  const category: CategoryWithProducts = (
    await axios.get(`${baseUrl}/api/category/${id}`)
  ).data;
  const categories: Category[] = (await axios.get(`${baseUrl}/api/categories`))
    .data;

  return {
    props: {
      category,
      otherCategories: categories.filter(
        (currentCategory) => currentCategory.id !== category.id
      ),
    },
  } satisfies GetServerSidePropsResult<unknown>;
}

export default EditCategoryPage;
