import { Box, Center, ChakraProvider } from "@chakra-ui/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { celo, goerli, optimism, sepolia } from "viem/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { theme } from "@/theme";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ALCHEMY_KEY_GOERLI, WALLETCONNECT_ID } from "@/config";
import { FrontierFoundation } from "@/components/frontier-foundation";
import { HypercertClientProvider } from "@/components/providers";
import { InteractionDialogProvider } from "@/components/interaction-modal";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [goerli, sepolia, celo, optimism],
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

export const FrontierFoundationPage = () => {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        <HypercertClientProvider>
          <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
              <InteractionDialogProvider>
                <Center
                  minHeight={"100vh"}
                  backgroundColor={"#F1F1F1"}
                  py={"80px"}
                >
                  <Box maxW={"960px"}>
                    <FrontierFoundation />
                  </Box>
                </Center>
              </InteractionDialogProvider>
            </ChakraProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </HypercertClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default FrontierFoundationPage;
