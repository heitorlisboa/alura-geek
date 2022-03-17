import type { FC } from "react";

import SearchSvg from "../../icons/SearchSvg";
import { classNames } from "../../utils";

import styles from "./SearchForm.module.scss";

type SearchFormProps = {
  className?: string;
};

const SearchForm: FC<SearchFormProps> = function SearchFormComponent({
  className,
}) {
  return (
    <form
      {...classNames([styles.searchForm, className])}
      role="search"
      onSubmit={(e) => e.preventDefault()}
    >
      <label htmlFor="search-product" className="sr-only"></label>
      <input
        className={styles.searchBox}
        type="search"
        name="search-product"
        id="search-product"
        role="searchbox"
        title="O que deseja encontrar?"
        placeholder="O que deseja encontrar?"
      />
      <button className={styles.searchButton} type="submit">
        <span className="sr-only">Pesquisar</span>
        <SearchSvg />
      </button>
    </form>
  );
};

export default SearchForm;
