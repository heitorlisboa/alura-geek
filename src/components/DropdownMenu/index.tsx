import { Children, type PropsWithChildren, useState } from "react";
import { useClickOutside } from "@mantine/hooks";
import type { FC } from "react";

import styles from "./DropdownMenu.module.scss";

import Button from "@components/Button";
import { classNames } from "@src/utils";

type DropdownMenuProps = PropsWithChildren<{
  menuTitle: string;
  className?: string;
}>;

const DropdownMenu: FC<DropdownMenuProps> = function DropdownMenuComponent({
  children,
  menuTitle,
  className,
}) {
  const childList = Children.toArray(children);
  const [expanded, setExpanded] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(handleClickOutside);

  const menuId = `${menuTitle}-menu`;

  function handleToggleMenu() {
    setExpanded((prevState) => !prevState);
  }

  function handleClickOutside() {
    setExpanded(false);
  }

  return (
    <div {...classNames([styles.wrapper, className])} ref={ref}>
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
          <li key={index} role="menuitem" onClick={handleClickOutside}>
            {child}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownMenu;
