import Router from "next/router";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
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
    const reader = new FileReader();

    reader.onload = async function () {
      const base64EncodedImage = reader.result as string;

      try {
        const apiRoute = "/api/product";
        const reqBody: ValidProductRequest = {
          name: data.productName,
          price: parseFloat(data.productPrice),
          description: data.productDescription,
          base64Image: base64EncodedImage,
          categoryName: data.productCategory,
        };

        const productId = Router.query.id as string;

        const { data: product }: { data: Product } =
          action === "create"
            ? await axios.post(apiRoute, reqBody)
            : await axios.put(`${apiRoute}/${productId}`, reqBody);

        Router.push(`/product/${product.id}`);
      } catch (error) {
        // TODO: Improve error notification
        alert("Erro ao adicionar produto");
      }
    };

    // TODO: Improve error notification
    reader.onerror = function () {
      alert("Erro ao processar imagem");
    };

    const imageBlob = Array.from(data.productImage)[0];

    reader.readAsDataURL(imageBlob);
  }

  useEffect(() => {
    /* As the initial image value stated in the `useForm` hook won't affect the
       file drop input, it's necessary to manually change the input files based
       on this initial value */
    const fileDropInput = fileDropInputRef.current;
    if (fileDropInput && initialValues?.productImage)
      changeInputFiles(fileDropInput, initialValues.productImage);
  }, [initialValues]);

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleProductSubmit)}>
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
          placeholder="Descrição do produto"
          errorMessage={getFormErrorMessage(errors.productDescription)}
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
