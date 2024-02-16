import { ZuconnectRetroactiveFund } from "@/components/zuconnect-retroactive-fund";
import { Box, Center, ChakraProvider } from "@chakra-ui/react";
import { createConfig, WagmiConfig, WagmiProvider } from "wagmi";
import { sepolia, optimism } from "viem/chains";
import {
  connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { index } from "@/theme";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { WALLETCONNECT_ID } from "@/config";
import { http } from "viem";

const projectId = WALLETCONNECT_ID;

const { wallets } = getDefaultWallets();

const connectors = connectorsForWallets(wallets, {
  projectId,
  appName: "Hyperboards",
});

const config = createConfig({
  // autoConnect: true,
  // publicClient,
  // webSocketPublicClient,
  chains: [sepolia, optimism],
  connectors,
  transports: {
    [optimism.id]: http(),
    [sepolia.id]: http(),
  },
  // wallets,
  // connectors,
});

export const ZuconnectRetroactiveFundPage = () => {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>
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
    </WagmiProvider>
  );
};

export default ZuconnectRetroactiveFundPage;
