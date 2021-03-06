import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import type { FC } from "react";

import styles from "./Header.module.scss";

import Container from "@components/Container";
import LogoSvg from "@icons/LogoSvg";
import ToggleDarkTheme from "@src/components/ToggleDarkTheme";
import DropdownMenu from "@components/DropdownMenu";
import Button from "@components/Button";
import SearchForm from "@components/SearchForm";
import SearchSvg from "@icons/SearchSvg";
import CloseSvg from "@icons/CloseSvg";
import { useWindowSize } from "@src/hooks/useWindowSize";
import { classNames } from "@src/utils";

const Header: FC = function HeaderComponent() {
  // Responsive layout
  const windowSize = useWindowSize();
  const mobile = windowSize < 768;

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
    <header className={styles.header}>
      <Container className={styles.headerContainer}>
        <a href="#main-content" className={styles.skipToContent}>
          Pular para o conteúdo
        </a>
        <div className={styles.titleAndForm}>
          <h1>
            <Link href="/" passHref>
              <a
                aria-label="Ir para página inicial"
                className={styles.logoAnchor}
              >
                <span className="sr-only">AluraGeek</span>
                <LogoSvg className={styles.logo} />
              </a>
            </Link>
          </h1>

          {!mobile && <SearchForm />}
        </div>

        <div className={styles.buttonsWrapper}>
          <ToggleDarkTheme />

          {isAuthenticated ? (
            <DropdownMenu menuTitle="Menu administrador">
              <Button as="link" variant="outlined" linkHref="/admin/products">
                Gerenciar produtos
              </Button>
              <Button as="link" variant="outlined" linkHref="/admin/categories">
                Gerenciar categorias
              </Button>
              <Button as="button" variant="outlined" onClick={handleSignOut}>
                Logout
              </Button>
            </DropdownMenu>
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
            <button type="submit" onClick={openSearchBar}>
              <span className="sr-only">Abrir barra de pesquisa</span>
              <SearchSvg className={styles.searchIcon} />
            </button>
          )}
        </div>

        {mobile && (
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
        )}
      </Container>
    </header>
  );
};

export default Header;
