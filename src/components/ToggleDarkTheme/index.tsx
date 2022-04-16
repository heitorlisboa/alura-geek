import { ActionIcon, useMantineColorScheme } from "@mantine/core";

import styles from "./ToggleDarkTheme.module.scss";

import MoonSvg from "@icons/MoonSvg";
import SunSvg from "@icons/SunSvg";

const ToggleDarkTheme = function ToggleDarkThemeComponent() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const darkTheme = colorScheme === "dark";

  function handleToggleDarkTheme() {
    toggleColorScheme();
  }

  return (
    <ActionIcon
      className={styles[colorScheme]}
      variant={darkTheme ? "filled" : "outline"}
      title="Alternar esquema de cores"
      onClick={handleToggleDarkTheme}
      size={30}
    >
      {darkTheme ? <SunSvg /> : <MoonSvg />}
    </ActionIcon>
  );
};

export default ToggleDarkTheme;
