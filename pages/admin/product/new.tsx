import Head from "next/head";
import { useForm } from "react-hook-form";
import type { NextPage } from "next";

import styles from "../../../src/styles/pages/admin/product/New.module.scss";

import Container from "../../../src/components/Container";
import FileDropInput from "../../../src/components/FileDropInput";
import ImagePlaceholderSvg from "../../../src/icons/ImagePlaceholderSvg";
import Input from "../../../src/components/Input";
import Button from "../../../src/components/Button";
import { bytesToMegaBytes, getFormErrorMessage } from "../../../src/utils";

type ProductFields = {
  productImage: FileList;
  productName: string;
  productPrice: string;
  productDescription: string;
};

const NewProduct: NextPage = function NewProductPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFields>();

  function handleNewProduct(data: ProductFields) {
    console.log(data);
    alert(
      "Submit bem sucedido! Confira o console para ver as informações do formulário"
    );
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

export default NewProduct;
