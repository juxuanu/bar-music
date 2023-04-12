import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";
import dynamic from "next/dynamic";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      ></Script>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
