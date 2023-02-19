import Link from "next/link";
import { type FC, useState } from "react";
import { signOut, useSession } from "next-auth/react";

import styles from "./Header.module.scss";

import { Container } from "@/components/Container";
import { LogoSvg } from "@/icons/LogoSvg";
import { ToggleDarkTheme } from "@/components/ToggleDarkTheme";
import { DropdownMenu } from "@/components/DropdownMenu";
import { Button } from "@/components/Button";
import { SearchForm } from "@/components/SearchForm";
import { SearchSvg } from "@/icons/SearchSvg";
import { CloseSvg } from "@/icons/CloseSvg";

export const Header: FC = () => {
  // Mobile search bar interaction
  const [mobileSearchBarIsOpen, setMobileSearchBarIsOpen] = useState(false);

  function openSearchBar() {
    setMobileSearchBarIsOpen(true);
  }

  function closeSearchBar() {
    setMobileSearchBarIsOpen(false);
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
            <Link className={styles.logoAnchor} href="/">
              <span className="sr-only">AluraGeek</span>
              <LogoSvg className={styles.logo} />
            </Link>
          </h1>

          <SearchForm className={styles.desktopSearchForm} />
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

          <button
            className={styles.mobileOpenSearchBarButton}
            type="submit"
            onClick={openSearchBar}
          >
            <span className="sr-only">Abrir barra de pesquisa</span>
            <SearchSvg className={styles.mobileSearchIcon} />
          </button>
        </div>

        {/* TODO: Refactor this to use a modal from Radix UI */}
        {mobileSearchBarIsOpen && (
          <div className={styles.mobileSearchFormWrapper}>
            <SearchForm className={styles.mobileSearchForm} />
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
