import Document, {
  type DocumentContext,
  type DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { createStylesServer, ServerStyles } from "@mantine/next";

import { emotionCache } from "@src/config/emotion-cache";

const stylesServer = createStylesServer(emotionCache);

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: [
        initialProps.styles,
        <ServerStyles
          key="styles"
          html={initialProps.html}
          server={stylesServer}
        />,
      ],
    };
  }
  render() {
    return (
      <Html lang="pt-br">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <meta
            name="description"
            content="Projeto de e-commerce desenvolvido durante o 3º Alura Challenge de Front-end"
          />
          <meta
            property="og:image"
            content="https://alura-geek-heitorlisboa.vercel.app/img/og-image.png"
          />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="800" />
          <meta property="og:image:height" content="450" />
          <meta
            property="og:image:alt"
            content="AluraGeek. Feito por Heitor Lisboa"
          />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
