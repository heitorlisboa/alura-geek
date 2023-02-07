import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { z } from "zod";

import { Container } from "@/components/Container";
import { CategoryForm } from "@/components/CategoryForm";
import { ProductsSelection } from "@/components/ProductsSelection";
import { prisma } from "@/lib/prisma";

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

  const { id } = paramsParseResult.data;

  const category = await prisma.category.findUnique({
    where: { id },
    include: { products: { orderBy: { updatedAt: "desc" } } },
  });

  if (!category)
    return { notFound: true } satisfies GetServerSidePropsResult<unknown>;

  const otherCategories = await prisma.category.findMany({
    where: { NOT: { id: category.id } },
  });

  return {
    props: {
      category,
      otherCategories,
    },
  } satisfies GetServerSidePropsResult<unknown>;
}

export default EditCategoryPage;
