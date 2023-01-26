import Router from "next/router";
import axios from "axios";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { LoadingOverlay } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import type { FC } from "react";
import type { Category, Product } from "@prisma/client";

import styles from "./ProductForm.module.scss";

import { FileDropInput } from "@components/FileDropInput";
import { ImagePlaceholderSvg } from "@icons/ImagePlaceholderSvg";
import { Select } from "@components/Select";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import {
  bytesToMegaBytes,
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

type InitialFormValues = Partial<
  Omit<FormFields, "productImage"> & {
    productImageUrl: string;
  }
>;

type ProductFormProps = {
  categories: Category[];
  action: "create" | "update";
  initialValues?: InitialFormValues;
};

export const ProductForm: FC<ProductFormProps> = ({
  categories,
  action,
  initialValues = {},
}) => {
  const { productImageUrl, ...defaultValues } = initialValues;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({ defaultValues });

  const [loading, setLoading] = useState(false);

  const required = action === "create";

  const fileDropInputRef = useRef<HTMLInputElement>(null);

  const fileDropInputFormRegistration = register("productImage", {
    required,
    validate: {
      onlyOneImage: (files) => files.length <= 1,
      mustBeImage: (files) => files[0]?.type.startsWith("image/"),
      lessThan5Mb: (files) => files[0] && bytesToMegaBytes(files[0].size) <= 5,
    },
  });

  const fileDropInputProps = {
    ...fileDropInputFormRegistration,
    ref: mergeRefs(fileDropInputRef, fileDropInputFormRegistration.ref),
  };

  async function handleProductSubmit(data: Partial<FormFields>) {
    /* If the file list exists and has any files, call the image converter
    function */
    if (data.productImage && data.productImage.length > 0) {
      const imageBlob = Array.from(data.productImage)[0];
      imgFileToBase64(imageBlob, callback, handleReadError);
    } else {
      callback();
    }

    async function callback(base64EncodedImage?: string | ArrayBuffer | null) {
      try {
        const apiRoute = "/api/product";
        /* None of the fields, except for the image and the category name, are
        undefined when empty (they are empty strings), so they need to have a
        backup value as undefined, otherwise this would accidentally change the
        values to empty instead of simply not changing them */
        const reqBody: Partial<ValidProductRequest> = {
          name: data.productName || undefined,
          price: data.productPrice ? parseFloat(data.productPrice) : undefined,
          description: data.productDescription || undefined,
          base64Image: base64EncodedImage as string | undefined,
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
      } catch (error: any) {
        // Removing the loading animation
        setLoading(false);
        // Error notification
        const keyword = action === "create" ? "adicionar" : "atualizar";
        showNotification({
          color: "red",
          title: error.response.data.error || `Erro ao ${keyword} produto`,
          message: error.response.data.message || "Erro desconhecido",
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
  }

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
          placeholderImage={productImageUrl}
          Icon={<ImagePlaceholderSvg />}
          {...fileDropInputProps}
        />

        <Select
          id="product-category"
          label="Categoria do produto"
          errorMessage={getFormErrorMessage(errors.productCategory)}
          labelVisible
          {...register("productCategory", { required })}
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
            required,
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
          {...register("productPrice", { required })}
        />

        <Input
          as="textarea"
          id="product-description"
          label="Descrição do produto"
          errorMessage={getFormErrorMessage(errors.productDescription)}
          labelVisible
          {...register("productDescription", {
            required,
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
