import type {
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";

import { Container } from "@/components/Container";
import { ProductForm } from "@/components/ProductForm";
import { prisma } from "@/server/db/client";

type NewProductPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

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

export async function getServerSideProps() {
  const categories = await prisma.category.findMany();

  return {
    props: {
      categories,
    },
  } satisfies GetServerSidePropsResult<unknown>;
}

export default NewProductPage;
