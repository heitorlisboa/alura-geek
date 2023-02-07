import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import type { Category } from "@prisma/client";
import { z } from "zod";

import { Container } from "@/components/Container";
import { ProductForm } from "@/components/ProductForm";
import { prisma } from "@/lib/prisma";

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
              name: product.name,
              price: product.price,
              description: product.description,
              imageUrl: product.imageUrl,
              categoryName: productCategory.name,
            }}
          />
        </Container>
      </main>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const paramsSchema = z.object({ id: z.string().uuid() });
  const paramsParseResult = paramsSchema.safeParse(context.params);

  if (!paramsParseResult.success)
    return { notFound: true } satisfies GetServerSidePropsResult<unknown>;

  const { id } = paramsParseResult.data;

  const product = await prisma.product.findUnique({ where: { id } });

  if (!product)
    return { notFound: true } satisfies GetServerSidePropsResult<unknown>;

  const categories = await prisma.category.findMany();

  return {
    props: {
      product,
      categories,
    },
  } satisfies GetServerSidePropsResult<unknown>;
}

export default EditProductPage;
