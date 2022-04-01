import Head from "next/head";
import axios from "axios";
import { useForm } from "react-hook-form";
import type { GetServerSideProps, NextPage } from "next";
import type { Category } from "@prisma/client";

import styles from "../../../src/styles/pages/admin/product/New.module.scss";

import Container from "../../../src/components/Container";
import FileDropInput from "../../../src/components/FileDropInput";
import ImagePlaceholderSvg from "../../../src/icons/ImagePlaceholderSvg";
import Select from "../../../src/components/Select";
import Input from "../../../src/components/Input";
import Button from "../../../src/components/Button";
import { bytesToMegaBytes, getFormErrorMessage } from "../../../src/utils";
import type { ValidProductRequest } from "../../../src/types/product";

type ProductFields = {
  productImage: FileList;
  productName: string;
  productPrice: string;
  productDescription: string;
  productCategory: string;
};

type NewProductProps = {
  categories: Category[];
};

const NewProduct: NextPage<NewProductProps> = function NewProductPage({
  categories,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFields>();

  async function handleNewProduct(data: ProductFields) {
    const reader = new FileReader();

    reader.onload = function () {
      const base64EncodedImage = reader.result;

      axios.post("/api/product", {
        name: data.productName,
        price: parseFloat(data.productPrice),
        description: data.productDescription,
        base64Image: base64EncodedImage,
        categoryName: data.productCategory,
      } as ValidProductRequest);
    };

    // TODO: Add error handling
    reader.onerror = function () {};

    const imageBlob = Array.from(data.productImage)[0];

    reader.readAsDataURL(imageBlob);
  }

  return (
    <>
      <Head>
        <title>Admin - Adicionar produto</title>
      </Head>

      <main>
        <Container className={styles.container}>
          <form onSubmit={handleSubmit(handleNewProduct)}>
            <h2 className={styles.formTitle}>Adicionar novo produto</h2>
            <div className={styles.formFields}>
              <FileDropInput
                className={styles.fileInput}
                description="Arraste ou clique para adicionar uma imagem para o produto"
                accept="image/*"
                errorMessage={getFormErrorMessage(errors.productImage)}
                Icon={<ImagePlaceholderSvg />}
                {...register("productImage", {
                  required: true,
                  validate: {
                    onlyOneImage: (files) => files.length === 1,
                    mustBeImage: (files) => files[0].type.startsWith("image/"),
                    lessThan5Mb: (files) =>
                      bytesToMegaBytes(files[0].size) <= 5,
                  },
                })}
              />

              <Select
                id="product-category"
                label="Categoria do produto"
                errorMessage={getFormErrorMessage(errors.productCategory)}
                {...register("productCategory", { required: true })}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(({ id, name }) => (
                  <option key={id} value={name}>
                    {name}
                  </option>
                ))}
              </Select>

              <Input
                id="product-name"
                label="Nome do produto"
                inputType="text"
                labelVisible
                errorMessage={getFormErrorMessage(errors.productName)}
                {...register("productName", { required: true })}
              />

              <Input
                id="product-price"
                label="Preço do produto (em reais)"
                inputType="number"
                labelVisible
                errorMessage={getFormErrorMessage(errors.productPrice)}
                {...register("productPrice", { required: true })}
              />

              <Input
                as="textarea"
                id="product-description"
                label="Descrição do produto"
                placeholder="Descrição do produto"
                errorMessage={getFormErrorMessage(errors.productDescription)}
                {...register("productDescription", { required: true })}
              />

              <Button as="button" buttonType="submit">
                Adicionar produto
              </Button>
            </div>
          </form>
        </Container>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: categories } = await axios.get(
    "http://localhost:3000/api/categories"
  );

  return {
    props: {
      categories,
    },
  };
};

export default NewProduct;
