import Head from "next/head";
import axios from "axios";
import { useEffect, useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
import type { Category, Product } from "@prisma/client";

import Container from "@components/Container";
import ProductForm from "@components/ProductForm";
import { getBaseUrl, imgUrlToFileList } from "@src/utils";

type EditProductProps = {
  product: Product;
  categories: Category[];
};

const EditProduct: NextPage<EditProductProps> = function EditProductPage({
  product,
  categories,
}) {
  const [imageFileList, setImageFileList] = useState<FileList>();
  const productCategory = categories.find(
    (category) => category.id === product.categoryId
  ) as Category;

  useEffect(() => {
    imgUrlToFileList(product.imageUrl, product.name, setImageFileList);
  }, [product]);

  return (
    <>
      <Head>
        <title>Admin - Editar produto</title>
      </Head>

      <main id="main-content">
        <Container>
          <ProductForm
            categories={categories}
            action="update"
            initialValues={{
              productImage: imageFileList,
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

export const getServerSideProps: GetServerSideProps<
  any,
  { id: string }
> = async (context) => {
  if (!context.params) return { notFound: true };

  const baseUrl = getBaseUrl(context.req.headers);

  const { id } = context.params;

  const { data: product } = await axios.get(`${baseUrl}/api/product/${id}`);
  const { data: categories } = await axios.get(`${baseUrl}/api/categories`);

  return {
    props: {
      product,
      categories,
    },
  };
};

export default EditProduct;
