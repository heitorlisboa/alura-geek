import Router from "next/router";
import { type FC, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingOverlay } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import type { Category, Product } from "@prisma/client";
import axios from "axios";

import styles from "./ProductForm.module.scss";

import { FileDropInput } from "@/components/FileDropInput";
import { ImagePlaceholderSvg } from "@/icons/ImagePlaceholderSvg";
import { Select } from "@/components/Select";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { imgFileToBase64, mergeRefs } from "@/utils";
import {
  productCreateFormSchema,
  type ProductUpdateFormSchema,
  productUpdateFormSchema,
  type ProductUpdateSchema,
} from "@/lib/productSchema";

type FormInitialValues = Omit<ProductUpdateFormSchema, "imageFileList"> & {
  imageUrl?: string;
};

type ProductFormProps = {
  categories: Category[];
  action: "create" | "update";
  initialValues?: FormInitialValues;
};

export const ProductForm: FC<ProductFormProps> = ({
  categories,
  action,
  initialValues = {},
}) => {
  const formSchema =
    action === "create" ? productCreateFormSchema : productUpdateFormSchema;

  const { imageUrl: productImageUrl, ...defaultValues } = initialValues;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductUpdateFormSchema>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const [loading, setLoading] = useState(false);

  const fileDropInputRef = useRef<HTMLInputElement>(null);

  const fileDropInputFormRegistration = register("imageFileList");

  const fileDropInputProps = {
    ...fileDropInputFormRegistration,
    ref: mergeRefs(fileDropInputRef, fileDropInputFormRegistration.ref),
  };

  async function handleProductSubmit(data: ProductUpdateFormSchema) {
    let base64EncodedImage = undefined;

    if (data.imageFileList) {
      const imageBlob = Array.from(data.imageFileList)[0];
      try {
        base64EncodedImage = (await imgFileToBase64(imageBlob))?.toString();
      } catch (error) {
        // Error notification
        showNotification({
          color: "red",
          message: "Erro ao processar imagem",
        });
      }
    }

    try {
      const apiRoute = "/api/product";
      const reqBody: ProductUpdateSchema = {
        name: data.name,
        price: data.price,
        description: data.description,
        base64Image: base64EncodedImage,
        categoryName: data.categoryName,
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
          errorMessage={errors.imageFileList?.message}
          placeholderImage={productImageUrl}
          Icon={<ImagePlaceholderSvg />}
          {...fileDropInputProps}
        />

        <Select
          id="product-category"
          label="Categoria do produto"
          errorMessage={errors.categoryName?.message}
          labelVisible
          {...register("categoryName")}
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
          errorMessage={errors.name?.message}
          {...register("name")}
        />

        <Input
          id="product-price"
          label="Preço do produto (em reais)"
          inputType="number"
          step={0.01}
          labelVisible
          errorMessage={errors.price?.message}
          {...register("price")}
        />

        <Input
          as="textarea"
          id="product-description"
          label="Descrição do produto"
          errorMessage={errors.description?.message}
          labelVisible
          {...register("description")}
        />

        <Button as="button" buttonType="submit">
          {action === "create" ? "Adicionar" : "Atualizar"} produto
        </Button>
      </div>
    </form>
  );
};
