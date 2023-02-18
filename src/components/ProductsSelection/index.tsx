import { type ChangeEvent, type FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox, Modal } from "@mantine/core";
import { randomId, useListState } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import type { Category, Product } from "@prisma/client";
import { z } from "zod";
import { TRPCClientError } from "@trpc/client";

import styles from "./ProductsSelection.module.scss";

import { Select } from "@/components/Select";
import { Button } from "@/components/Button";
import { TrashSvg } from "@/icons/TrashSvg";
import { MoveFromGroupSvg } from "@/icons/MoveFromGroupSvg";
import { trpc } from "@/utils";

type FormFields = { categoryName: string };

type ProductsSelectionProps = {
  initialProducts: Product[];
  otherCategories: Category[];
};

export const ProductsSelection: FC<ProductsSelectionProps> = ({
  initialProducts,
  otherCategories,
}) => {
  const productSelecionTitleId = "product-selection-title";

  // Modals states and functions
  const [deleteProductModalOpened, setDeleteProductModalOpened] =
    useState(false);
  const [moveProductModalOpened, setMoveProductModalOpened] = useState(false);

  // Product category change form
  const formSchema = z.object({
    categoryName: z.string().min(1, "Obrigatório"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });

  // tRPC mutations
  const productDeleteMutation = trpc.product.delete.useMutation();
  const productUpdateMutation = trpc.product.update.useMutation();

  // Products management states and functions
  const [products, setProducts] = useState(initialProducts);
  const [values, handlers] = useListState(
    products.map((product) => ({ id: product.id, checked: false }))
  );
  /* If `values` is empty, the `every` method will return true. So first we need
  to check if it has any items to prevent the variable from being true when the
  list is empty */
  const allChecked =
    values.length > 0 && values.every((value) => value.checked);
  const anyIsChecked = values.some((value) => value.checked);
  const indeterminate = anyIsChecked && !allChecked;

  function handleChangeAllProductsCheckbox() {
    handlers.setState((prevState) =>
      prevState.map((value) => ({ ...value, checked: !allChecked }))
    );
  }

  function handleChangeSingleProductCheckbox(
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) {
    handlers.setItemProp(index, "checked", event.currentTarget.checked);
  }

  function removeProductsFromStates<T extends { id: string }>(
    productsToRemove: T[]
  ) {
    /* Removing the checked products from the list state and from the `product`
    state */
    function setStateAction<T extends { id: string }>(prevState: T[]) {
      return prevState.filter(
        (value) => !productsToRemove.some((product) => product.id === value.id)
      );
    }
    /* Note that these set state actions need to be in this exact order because
    if you remove the products from the list state first, you'll get an error
    when rendering the products, so first you need the component to be deleted
    (which depends on the `products` state), and then you'll be able to dele
    from the list state */
    setProducts(setStateAction);
    handlers.setState(setStateAction);
  }

  async function handleDeleteProducts() {
    // Closing the modal
    setDeleteProductModalOpened(false);
    // Filtering the checked products to delete
    const checkedProducts = values.filter((value) => value.checked);
    // Setting the loading notification
    const notificationId = `delete-product-${randomId()}`;
    showNotification({
      id: notificationId,
      message: "Deletando produto(s), espere um momento...",
      loading: true,
      autoClose: false,
      disallowClose: true,
    });

    try {
      // Product category deletion request
      const deletedProducts = await Promise.all(
        checkedProducts.map(
          async ({ id }) =>
            (
              await productDeleteMutation.mutateAsync({ id })
            ).product
        )
      );
      // Removing the products from the states
      removeProductsFromStates(deletedProducts);
      // Success notification
      updateNotification({
        id: notificationId,
        color: "green",
        message: "Produto(s) deletado(s) com sucesso",
      });
    } catch (error) {
      // Error notification
      updateNotification({
        id: notificationId,
        color: "red",
        message:
          error instanceof TRPCClientError
            ? error.message
            : "Erro desconhecido",
      });
    }
  }

  async function handleMoveProducts({ categoryName }: FormFields) {
    // Closing the modal
    setMoveProductModalOpened(false);
    // Filtering the checked products to move
    const checkedProducts = values.filter((value) => value.checked);
    // Setting the loading notification
    const notificationId = `move-product-${randomId()}`;
    showNotification({
      id: notificationId,
      message:
        `Movendo produto(s) para a categoria ${categoryName}` +
        ", espere um momento...",
      loading: true,
      autoClose: false,
      disallowClose: true,
    });

    try {
      // Product category change request
      const movedProducts = await Promise.all(
        checkedProducts.map(
          async ({ id }) =>
            (
              await productUpdateMutation.mutateAsync({ id, categoryName })
            ).product
        )
      );
      // Removing the products from the states
      removeProductsFromStates(movedProducts);
      // Success notification
      updateNotification({
        id: notificationId,
        color: "green",
        message: "Produto(s) movidos(s) com sucesso",
      });
    } catch (error) {
      // Error notification
      updateNotification({
        id: notificationId,
        color: "red",
        message:
          error instanceof TRPCClientError
            ? error.message
            : "Erro desconhecido",
      });
    }
  }

  return (
    <section
      className={styles.section}
      aria-labelledby={productSelecionTitleId}
    >
      {/* Delete product(s) modal */}
      <Modal
        title="Tem certeza que quer excluir esse(s) produto(s)?"
        opened={deleteProductModalOpened}
        onClose={() => setDeleteProductModalOpened(false)}
        closeButtonLabel="Cancelar deleção do(s) produto(s)"
      >
        <Button onClick={handleDeleteProducts}>Confirmar</Button>
      </Modal>

      {/* Move product(s) modal */}
      <Modal
        title="Selecione a categoria para qual quer mover o(s) produto(s)"
        opened={moveProductModalOpened}
        onClose={() => setMoveProductModalOpened(false)}
        closeButtonLabel="Cancelar mudança de categoria do(s) produto(s)"
      >
        <form
          className={styles.categoryMoveForm}
          onSubmit={handleSubmit(handleMoveProducts)}
        >
          <Select
            id="category-to-move-to"
            label="Categoria"
            errorMessage={errors.categoryName?.message}
            {...register("categoryName")}
          >
            <option value="">Selecione uma categoria</option>
            {otherCategories.map(({ id, name }) => (
              <option key={id} value={name}>
                {name}
              </option>
            ))}
          </Select>
          <Button buttonType="submit">Confirmar</Button>
        </form>
      </Modal>

      <h3 id={productSelecionTitleId}>Produtos dessa categoria</h3>

      <header className={styles.header}>
        <Checkbox
          label="Todos os produtos"
          checked={allChecked}
          indeterminate={indeterminate}
          onChange={handleChangeAllProductsCheckbox}
        />
        {anyIsChecked && (
          <>
            <button
              type="button"
              onClick={() => setDeleteProductModalOpened(true)}
            >
              <span className="sr-only">Excluir produto(s) selecionado(s)</span>
              <TrashSvg />
            </button>
            <button
              type="button"
              onClick={() => setMoveProductModalOpened(true)}
            >
              <span className="sr-only">Mover produto(s) selecionado(s)</span>
              <MoveFromGroupSvg />
            </button>
          </>
        )}
      </header>

      {products.map((product, index) => (
        <Checkbox
          key={product.id}
          label={product.name}
          checked={values[index]?.checked}
          onChange={(event) => {
            handleChangeSingleProductCheckbox(index, event);
          }}
        />
      ))}
    </section>
  );
};
