import { Children, useState } from "react";
import type { FC } from "react";

import styles from "./DropdownMenu.module.scss";

import Button from "@components/Button";
import { classNames } from "@src/utils";

type DropdownMenuProps = {
  menuTitle: string;
  className?: string;
};

const DropdownMenu: FC<DropdownMenuProps> = function DropdownMenuComponent({
  children,
  menuTitle,
  className,
}) {
  const childList = Children.toArray(children);
  const [expanded, setExpanded] = useState(false);

  const menuId = `${menuTitle}-menu`;

  function handleToggleMenu() {
    setExpanded((prevState) => !prevState);
  }

  return (
    <div {...classNames([styles.wrapper, className])}>
      <Button
        className={styles.toggleButton}
        as="button"
        variant="outlined"
        aria-controls={menuId}
        aria-expanded={expanded}
        onClick={handleToggleMenu}
      >
        {menuTitle}
      </Button>
      <ul
        id={menuId}
        className={styles.menu}
        role="menu"
        aria-label={menuTitle}
      >
        {childList.map((child, index) => (
          <li key={index} role="menuitem">
            {child}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownMenu;
