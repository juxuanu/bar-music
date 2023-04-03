import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ca">
      <Head>
        <meta name="description" content="Música per Youtube per bars" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
