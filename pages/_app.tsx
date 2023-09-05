import "styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { PlasmicRootProvider } from "@plasmicapp/react-web";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { goerli } from "viem/chains";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [goerli],
  [publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors,
});

const queryClient = new QueryClient();
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlasmicRootProvider Head={Head}>
      <WagmiConfig config={config}>
        <RainbowKitProvider chains={chains}>
          <QueryClientProvider client={queryClient}>
            <ChakraProvider>
              <Component {...pageProps} />
            </ChakraProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </PlasmicRootProvider>
  );
}
