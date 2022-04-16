import Head from "next/head";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { parseCookies, setCookie } from "nookies";
import {
  MantineProvider,
  ColorSchemeProvider,
  type ColorScheme,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import type { AppProps } from "next/app";

import "@src/styles/global/index.scss";

import Header from "@components/Header";
import Footer from "@components/Footer";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");

  function toggleColorScheme(value?: ColorScheme) {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    // Updating the state and the cookie
    setColorScheme(nextColorScheme);
    setCookie(null, "color-scheme", nextColorScheme);
  }

  useEffect(() => {
    /* On load, parse the cookies and set the color scheme state if the
    correspondent cookie exists */
    const {
      "color-scheme": colorSchemeCookie,
    }: { "color-scheme"?: ColorScheme } = parseCookies();

    if (colorSchemeCookie) setColorScheme(colorSchemeCookie);
  }, []);

  useEffect(() => {
    /* On load and when the color scheme state changes, set the theme data
    attribute to the color scheme value */
    document.body.dataset.theme = colorScheme;
  }, [colorScheme]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider theme={{ colorScheme, fontFamily: "Raleway" }}>
        <NotificationsProvider>
          <SessionProvider session={session}>
            <Head>
              <meta charSet="UTF-8" />
              <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
              <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/apple-touch-icon.png"
              />
              <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href="/favicon-32x32.png"
              />
              <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href="/favicon-16x16.png"
              />
              <link rel="manifest" href="/site.webmanifest" />
              <link
                rel="mask-icon"
                href="/safari-pinned-tab.svg"
                color="#2a7ae4"
              />
              <meta name="msapplication-TileColor" content="#2d89ef" />
              <meta name="theme-color" content="#ffffff" />
            </Head>

            <Header />

            <Component {...pageProps} />

            <Footer />
          </SessionProvider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default MyApp;
