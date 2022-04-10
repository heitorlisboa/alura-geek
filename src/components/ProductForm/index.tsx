import Router from "next/router";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { LoadingOverlay } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import type { FC } from "react";
import type { Category, Product } from "@prisma/client";

import styles from "./ProductForm.module.scss";

import FileDropInput from "@components/FileDropInput";
import ImagePlaceholderSvg from "@icons/ImagePlaceholderSvg";
import Select from "@components/Select";
import Input from "@components/Input";
import Button from "@components/Button";
import {
  bytesToMegaBytes,
  changeInputFiles,
  getFormErrorMessage,
  imgFileToBase64,
  mergeRefs,
} from "@src/utils";
import type { ValidProductRequest } from "@src/types/product";

type FormFields = {
  productImage: FileList;
  productName: string;
  productPrice: string;
  productDescription: string;
  productCategory: string;
};

type ProductFormProps = {
  categories: Category[];
  action: "create" | "update";
  initialValues?: Partial<FormFields>;
};

const ProductForm: FC<ProductFormProps> = function ProductFormComponent({
  categories,
  action,
  initialValues,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({ defaultValues: initialValues });
  const [loading, setLoading] = useState(false);

  const fileDropInputRef = useRef<HTMLInputElement>(null);

  const fileDropInputFormRegistration = register("productImage", {
    required: true,
    validate: {
      onlyOneImage: (files) => files.length === 1,
      mustBeImage: (files) => files[0].type.startsWith("image/"),
      lessThan5Mb: (files) => bytesToMegaBytes(files[0].size) <= 5,
    },
  });

  const fileDropInputProps = {
    ...fileDropInputFormRegistration,
    ref: mergeRefs(fileDropInputRef, fileDropInputFormRegistration.ref),
  };

  async function handleProductSubmit(data: FormFields) {
    const imageBlob = Array.from(data.productImage)[0];

    async function callback(base64EncodedImage: string | ArrayBuffer | null) {
      try {
        const apiRoute = "/api/product";
        const reqBody: ValidProductRequest = {
          name: data.productName,
          price: parseFloat(data.productPrice),
          description: data.productDescription,
          base64Image: base64EncodedImage as string,
          categoryName: data.productCategory,
        };

        const productId = Router.query.id as string;

        // Setting the loading animation
        setLoading(true);
        // Doing the create/update request
        const { data: product }: { data: Product } =
          action === "create"
            ? await axios.post(apiRoute, reqBody)
            : await axios.put(`${apiRoute}/${productId}`, reqBody);

        // Redirecting to the created/updated product page
        Router.push(`/product/${product.id}`);
      } catch (error) {
        // Removing the loading animation
        setLoading(false);
        // Error notification
        const keyword = action === "create" ? "adicionar" : "atualizar";
        showNotification({
          color: "red",
          message: `Erro ao ${keyword} produto`,
        });
      }
    }

    function handleReadError() {
      // Error notification
      showNotification({
        color: "red",
        message: "Erro ao processar imagem",
      });
    }

    imgFileToBase64(imageBlob, callback, handleReadError);
  }

  /**
   * As the initial image value stated in the `useForm` hook won't affect the
   * file drop input, it's necessary to manually change the input files based on
   * this initial value
   */
  useEffect(() => {
    const fileDropInput = fileDropInputRef.current;
    if (fileDropInput && initialValues?.productImage)
      changeInputFiles(fileDropInput, initialValues.productImage);
  }, [initialValues]);

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleProductSubmit)}>
      <LoadingOverlay visible={loading} />
      <h2 className={styles.formTitle}>
        {action === "create" ? "Adicionar novo" : "Atualizar"} produto
      </h2>
      <div className={styles.formFields}>
        <FileDropInput
          className={styles.fileInput}
          description="Arraste ou clique para adicionar uma imagem para o produto"
          accept="image/*"
          errorMessage={getFormErrorMessage(errors.productImage)}
          Icon={<ImagePlaceholderSvg />}
          {...fileDropInputProps}
        />

        <Select
          id="product-category"
          label="Categoria do produto"
          errorMessage={getFormErrorMessage(errors.productCategory)}
          labelVisible
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
          {...register("productName", {
            required: true,
            maxLength: {
              value: 50,
              message: "Máximo de 50 caracteres",
            },
          })}
        />

        <Input
          id="product-price"
          label="Preço do produto (em reais)"
          inputType="number"
          step={0.01}
          labelVisible
          errorMessage={getFormErrorMessage(errors.productPrice)}
          {...register("productPrice", { required: true })}
        />

        <Input
          as="textarea"
          id="product-description"
          label="Descrição do produto"
          errorMessage={getFormErrorMessage(errors.productDescription)}
          labelVisible
          {...register("productDescription", {
            required: true,
            maxLength: {
              value: 300,
              message: "Máximo de 300 caracteres",
            },
          })}
        />

        <Button as="button" buttonType="submit">
          {action === "create" ? "Adicionar" : "Atualizar"} produto
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
