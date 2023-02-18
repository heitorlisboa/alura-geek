import Router from "next/router";
import { type FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingOverlay } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { TRPCClientError } from "@trpc/client";

import styles from "./CategoryForm.module.scss";

import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import {
  type CategoryCreateSchema,
  categoryCreateSchema,
  type CategoryUpdateSchema,
  categoryUpdateSchema,
} from "@/lib/categorySchema";
import { trpc } from "@/utils";

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

  const categoryCreateMutation = trpc.category.create.useMutation();
  const categoryUpdateMutation = trpc.category.update.useMutation();

  const [loading, setLoading] = useState(false);

  async function handleCategorySubmit(data: CategoryUpdateSchema) {
    try {
      const categoryId = Router.query.id as string;

      // Setting the loading animation
      setLoading(true);

      // Doing the create or update request
      const { category } =
        action === "create"
          ? await categoryCreateMutation.mutateAsync({
              name: data.name as CategoryCreateSchema["name"],
            })
          : await categoryUpdateMutation.mutateAsync({
              id: categoryId,
              name: data.name,
            });

      // Redirecting to the created/updated product page
      Router.push(`/category/${category.id}`);
    } catch (error) {
      // Removing the loading animation
      setLoading(false);

      // Error notification
      showNotification({
        color: "red",
        message:
          error instanceof TRPCClientError
            ? error.message
            : "Erro desconhecido",
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
