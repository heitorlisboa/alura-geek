import Router from "next/router";
import { useForm } from "react-hook-form";
import type { FC } from "react";
import clsx from "clsx";

import styles from "./SearchForm.module.scss";

import { SearchSvg } from "@icons/SearchSvg";

type FormFields = {
  searchProduct: string;
};

type SearchFormProps = {
  className?: string;
};

export const SearchForm: FC<SearchFormProps> = ({ className }) => {
  const { register, handleSubmit } = useForm<FormFields>();

  function handleSearch({ searchProduct }: FormFields) {
    Router.push(`/products/search?q=${searchProduct}`);
  }

  return (
    <form
      className={clsx(styles.searchForm, className)}
      role="search"
      onSubmit={handleSubmit(handleSearch)}
    >
      <label htmlFor="search-product" className="sr-only">
        Buscar produto
      </label>
      <input
        id="search-product"
        className={styles.searchBox}
        type="search"
        role="searchbox"
        title="O que deseja encontrar?"
        placeholder="O que deseja encontrar?"
        {...register("searchProduct")}
      />
      <button className={styles.searchButton} type="submit">
        <span className="sr-only">Pesquisar</span>
        <SearchSvg />
      </button>
    </form>
  );
};
