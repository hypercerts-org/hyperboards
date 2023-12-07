import { ZuconnectRetroactiveFund } from "@/components/zuconnect-retroactive-fund";
import { Box, Center, ChakraProvider } from "@chakra-ui/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { goerli, mainnet } from "viem/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { index } from "@/theme";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ALCHEMY_KEY_GOERLI, WALLETCONNECT_ID } from "@/config";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, goerli],
  [
    alchemyProvider({
      apiKey: ALCHEMY_KEY_GOERLI,
    }),
    publicProvider(),
  ],
);

const { connectors } = getDefaultWallets({
  appName: "Hyperboards",
  projectId: WALLETCONNECT_ID,
  chains,
});

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors,
});

export const ZuconnectRetroactiveFundPage = () => {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={index}>
            <Center minHeight={"100vh"} backgroundColor={"#F1F1F1"} py={"80px"}>
              <Box maxW={"550px"}>
                <ZuconnectRetroactiveFund />
              </Box>
            </Center>
          </ChakraProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default ZuconnectRetroactiveFundPage;
