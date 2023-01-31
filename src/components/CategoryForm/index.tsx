import Router from "next/router";
import { type FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingOverlay } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import type { Category } from "@prisma/client";
import axios from "axios";

import styles from "./CategoryForm.module.scss";

import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import {
  categoryCreateSchema,
  type CategoryUpdateSchema,
  categoryUpdateSchema,
} from "@/lib/categorySchema";

type CategoryFormProps = {
  action: "create" | "update";
  initialValues?: CategoryUpdateSchema;
};

export const CategoryForm: FC<CategoryFormProps> = ({
  action,
  initialValues,
}) => {
  const formSchema =
    action === "create" ? categoryCreateSchema : categoryUpdateSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryUpdateSchema>({
    defaultValues: initialValues,
    resolver: zodResolver(formSchema),
  });

  const [loading, setLoading] = useState(false);

  async function handleCategorySubmit(data: CategoryUpdateSchema) {
    try {
      const apiRoute = "/api/category";
      const reqBody: CategoryUpdateSchema = { name: data.name };
      const categoryId = Router.query.id as string;

      // Setting the loading animation
      setLoading(true);
      // Doing the create/update request
      const { data: category }: { data: Category } =
        action === "create"
          ? await axios.post(apiRoute, reqBody)
          : await axios.put(`${apiRoute}/${categoryId}`, reqBody);

      // Redirecting to the created/updated product page
      Router.push(`/category/${category.id}`);
    } catch (error: any) {
      // Removing the loading animation
      setLoading(false);
      // Error notification
      const keyword = action === "create" ? "adicionar" : "atualizar";
      showNotification({
        color: "red",
        title: error.response.data.error || `Erro ao ${keyword} categoria`,
        message: error.response.data.message || "Erro desconhecido",
      });
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleCategorySubmit)}>
      <LoadingOverlay visible={loading} />

      <h2 className={styles.formTitle}>
        {action === "create" ? "Adicionar nova" : "Atualizar"} categoria
      </h2>

      <div className={styles.formFields}>
        <Input
          id="category-name"
          label="Nome da categoria"
          inputType="text"
          labelVisible
          errorMessage={errors.name?.message}
          {...register("name")}
        />

        <Button as="button" buttonType="submit" variant="contained">
          {action === "create" ? "Adicionar" : "Atualizar"} categoria
        </Button>
      </div>
    </form>
  );
};
