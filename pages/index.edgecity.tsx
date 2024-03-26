import { Box, Center, ChakraProvider } from "@chakra-ui/react";
import { createConfig, WagmiConfig, WagmiProvider } from "wagmi";
import { sepolia, optimism, mainnet } from "viem/chains";
import {
  connectorsForWallets,
  getDefaultConfig,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { index } from "@/theme";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { WALLETCONNECT_ID } from "@/config";
import { http } from "viem";
import { EdgeCityFund } from "@/components/edgecity-fund";
import {
  argentWallet,
  bitskiWallet,
  braveWallet,
  dawnWallet,
  imTokenWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  mewWallet,
  okxWallet,
  omniWallet,
  phantomWallet,
  rabbyWallet,
  rainbowWallet,
  safeWallet,
  tahoWallet,
  trustWallet,
  walletConnectWallet,
  xdefiWallet,
  zerionWallet,
} from "@rainbow-me/rainbowkit/wallets";
import connectors from "@celo/rainbowkit-celo/lists";

const projectId = WALLETCONNECT_ID;

const config = getDefaultConfig({
  projectId,
  appName: "Hyperboards",
  chains: [sepolia, optimism, mainnet],
  ssr: true,
  wallets: [
    {
      groupName: "Recommended",
      wallets: [
        argentWallet,
        bitskiWallet,
        braveWallet,
        dawnWallet,
        imTokenWallet,
        ledgerWallet,
        metaMaskWallet,
        mewWallet,
        okxWallet,
        omniWallet,
        phantomWallet,
        rabbyWallet,
        rainbowWallet,
        walletConnectWallet,
        safeWallet,
        tahoWallet,
        trustWallet,
        xdefiWallet,
        zerionWallet,
      ],
    },
    {
      groupName: "Injected",
      wallets: [injectedWallet],
    },
  ],
});

const queryClient = new QueryClient();

export const EdgecityFundPage = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ChakraProvider theme={index}>
            <Center minHeight={"100vh"} backgroundColor={"#F1F1F1"} py={"80px"}>
              <Box maxW={"550px"}>
                <EdgeCityFund />
              </Box>
            </Center>
          </ChakraProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default EdgecityFundPage;
