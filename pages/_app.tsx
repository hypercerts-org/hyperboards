import "styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { PlasmicRootProvider } from "@plasmicapp/react-web";
import type { AppProps } from "next/app";
import Head from "next/head";

import { Providers } from "@/components/providers";
import { Layout } from "@/components/layout";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <PlasmicRootProvider Head={Head}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PlasmicRootProvider>
    </Providers>
  );
}
