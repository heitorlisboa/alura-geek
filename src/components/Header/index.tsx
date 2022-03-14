import Link from "next/link";
import { useState } from "react";
import type { FC } from "react";

import Button from "../Button";
import SearchForm from "../SearchForm";
import SearchSvg from "../svgs/SearchSVG";
import CloseSvg from "../svgs/CloseSvg";
import { useWindowSize } from "../../hooks/WindowSize";
import { classNames } from "../../utils";

import styles from "./Header.module.scss";

const Header: FC = function HeaderComponent() {
  const [searchBarIsOpen, setSearchBarIsOpen] = useState(false);
  const windowSize = useWindowSize();
  const mobile = windowSize < 650;

  function openSearchBar() {
    setSearchBarIsOpen(true);
  }

  function closeSearchBar() {
    setSearchBarIsOpen(false);
  }

  return (
    <header className={styles.header}>
      <div className={styles.titleAndForm}>
        <h1>
          <Link href="/" passHref>
            <a>
              <span className="sr-only">AluraGeek</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.logo} src="/svg/logo.svg" alt="Logo" />
            </a>
          </Link>
        </h1>

        {!mobile && <SearchForm />}
      </div>

      <Button
        className={styles.loginButton}
        variant="outlined"
        as="link"
        linkHref="/login"
      >
        Login
      </Button>

      {mobile && (
        <>
          <button
            className={styles.toggleSearchButton}
            type="submit"
            onClick={openSearchBar}
          >
            <span className="sr-only">Abrir barra de pesquisa</span>
            <SearchSvg className={styles.searchIcon} />
          </button>

          <div
            {...classNames([
              styles.searchFormWrapper,
              searchBarIsOpen ? styles.active : "",
            ])}
          >
            <SearchForm className={styles.searchForm} />
            <button onClick={closeSearchBar}>
              <span className="sr-only">Fechar barra de pesquisa</span>
              <CloseSvg />
            </button>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
