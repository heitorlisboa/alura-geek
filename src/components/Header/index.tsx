import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import type { FC } from "react";

import Container from "../Container";
import Button from "../Button";
import SearchForm from "../SearchForm";
import SearchSvg from "../../icons/SearchSvg";
import CloseSvg from "../../icons/CloseSvg";
import { useWindowSize } from "../../hooks/WindowSize";
import { classNames } from "../../utils";

import styles from "./Header.module.scss";

const Header: FC = function HeaderComponent() {
  // Responsive layout
  const windowSize = useWindowSize();
  const mobile = windowSize < 650;

  // Mobile search bar interaction
  const [searchBarIsOpen, setSearchBarIsOpen] = useState(false);

  function openSearchBar() {
    setSearchBarIsOpen(true);
  }

  function closeSearchBar() {
    setSearchBarIsOpen(false);
  }

  // Authentication
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  function handleSignOut() {
    signOut({ redirect: true, callbackUrl: "/" });
  }

  return (
    <header>
      <Container className={styles.headerContainer}>
        <div className={styles.titleAndForm}>
          <h1>
            <Link href="/" passHref>
              <a aria-label="Ir para página inicial">
                <span className="sr-only">AluraGeek</span>
                <img
                  className={styles.logo}
                  src="/svg/logo.svg"
                  alt="Logo AluraGeek"
                />
              </a>
            </Link>
          </h1>

          {!mobile && <SearchForm />}
        </div>

        {isAuthenticated ? (
          <Button
            className={styles.sessionButton}
            as="button"
            variant="outlined"
            onClick={handleSignOut}
          >
            Logout
          </Button>
        ) : (
          <Button
            className={styles.sessionButton}
            as="link"
            variant="outlined"
            linkHref="/login"
          >
            Login
          </Button>
        )}

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
                searchBarIsOpen ? styles.active : undefined,
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
      </Container>
    </header>
  );
};

export default Header;
