import Router from "next/router";
import { type FC, useState } from "react";
import { useForm } from "react-hook-form";
import { LoadingOverlay } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import type { Category } from "@prisma/client";
import axios from "axios";

import styles from "./CategoryForm.module.scss";

import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { getFormErrorMessage } from "@/utils";
import { type CategoryCreateSchema } from "@/lib/categorySchema";

type FormFields = {
  categoryName: string;
};

type CategoryFormProps = {
  action: "create" | "update";
  initialValues?: Partial<FormFields>;
};

export const CategoryForm: FC<CategoryFormProps> = ({
  action,
  initialValues,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({ defaultValues: initialValues });

  const [loading, setLoading] = useState(false);

  const required = action === "create";

  async function handleCategorySubmit(data: Partial<FormFields>) {
    try {
      const apiRoute = "/api/category";
      /* This field is not undefined when empty (it is an empty string), so it
      needs a backup value as undefined, otherwise this would accidentally
      change its value to empty instead of simply not changing it */
      const reqBody: Partial<CategoryCreateSchema> = {
        name: data.categoryName || undefined,
      };

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
          errorMessage={getFormErrorMessage(errors.categoryName)}
          {...register("categoryName", { required })}
        />

        <Button as="button" buttonType="submit" variant="contained">
          {action === "create" ? "Adicionar" : "Atualizar"} categoria
        </Button>
      </div>
    </form>
  );
};
