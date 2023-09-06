import { PropsWithChildren } from "react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { goerli } from "viem/chains";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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

export const Providers = ({
  showReactQueryDevtools = true,
  children,
}: PropsWithChildren<{ showReactQueryDevtools?: boolean }>) => {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider>{children}</ChakraProvider>
          {showReactQueryDevtools && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
