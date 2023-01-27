import Head from "next/head";
import axios from "axios";
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import type { Category } from "@prisma/client";

import { Container } from "@/components/Container";
import { ProductForm } from "@/components/ProductForm";
import { getBaseUrl } from "@/utils";

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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const baseUrl = getBaseUrl(context.req.headers);

  const categories: Category[] = (await axios.get(`${baseUrl}/api/categories`))
    .data;

  return {
    props: {
      categories,
    },
  } satisfies GetServerSidePropsResult<unknown>;
}

export default NewProductPage;
